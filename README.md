# AI Tools

This is a service that uses OpenAI to create summaries of audio transcriptions (text).

## Architecture

This application is composed of four services:

- API
- Worker
- PostgreSQL
- RabbitMQ

### API

This is the entry point for the application.
It is an Express web application that exposes a REST API.
It allows a client to request summaries of audio **transcriptions** through `POST /api/transcription`.
When that endpoint is used the following happens:

- It calculates a hash for the submitted content that will be summarized
- The database is queried for a hash that matches:
  - If there's content whose hash matches:
    - the transcription data is simply returned as stored in the database
  - If there isn't content whose hash matches:
    - It stores the content along with its hash in PostgreSQL with `status = queued`
    - It adds a message to RabbitMQ so that it's received by the Worker service
    - Returns the transcription data (with `status = queued` and an empty summary)

A client can get a transcription data with `GET /api/transcription/:uuid`.

### Worker

When a message is received by the worker through RabbitMQ the following steps take place:

- The worker updates the status of the transcription to `processing` by using the `PUT /api/transcription/:uuid` endpoint in API
- The worker sends a request to OpenAI to get the summary of the transcription
  - If the request fails, the worker updates the transcription with `status = error`
  - If the request succeeds, the worker updates the transcription with `status = completed` and by setting the transcription summary

The rate limit is controlled by defining a limit on the number of workers consuming messages, which is 5.
Workers take a minimium of 1 second to process messages (set artificially by using `setTimeout`), so no new messages are consumed by workers before 1 second has been elapsed since the worker received a message.

## Project layout

- `api`: code related to the API service, that runs within a Docker container
- `worker`: code related to the Worker service, that runs within a Docker container
- `integration-tests`: integration tests that are run in the host, outside Docker containers

## How to run

In order to run AI Tools you need to install the following:

- [Docker](https://www.docker.com/)
- [NodeJS](https://nodejs.org/en) (the application has been tested with version v18.15.0, but later versions should work as well)

And you will also need to have:

- A valid OpenAI API key

Then follow these steps:

- Clone this repo with `git clone git@github.com:manugrandio/ai-tools.git`
- Run `cd ai-tools`
- Make a copy of the sample environment file with `cp .env.test .env`
- Set the value of `OPENAI_API_KEY` in the `.env` file with your OpenAI API key
- Start the application by running `docker compose up --build`
- When it's ready run database migrations with `docker exec -it api npm run migration:run`

The application is now running.

## Testing

*Note: before running tests make sure the application is running by following the steps described in the previous section.*

You can run **unit tests** for each service.
They are run withing their Docker containers:

- **api**: `docker exec -it api npm run test`
- **worker**: `docker exec -it worker npm run test`

You can also run the **integration tests**.
It is run in your host, outside of the Docker environment, so you have to do the following:

- `cd integration-tests`
- `npm install --development`
- `npm run test`

#### Useful commands

Comamand to list all created transcriptions:

```
docker exec -it postgres psql --username postgres -d postgres -c 'SELECT * FROM transcription'
```

Command to delete all created transcriptions:

```
docker exec -it postgres psql --username postgres -d postgres -c 'DELETE FROM transcription'
```

### Manual tests

You can also run your own manual tests with the client of your choice.
You can use two endpoints:

#### Create a transcription

```
POST /api/transcription

{
  "content": "<YOUR TEXT HERE>"
}
```

The response looks like the following:

```
{
    "hash": "896858012918caf3adeefa9fde2c43e7",
    "content": "some content",
    "summary": null,
    "uuid": "b3b09e2e-d9f9-4cc2-b29a-8c0b3d5cbbd4",
    "status": "queued"
}
```

#### Get a transcription

```
GET /api/transcription/:uuid
```

The response looks like the following:

```
{
    "hash": "896858012918caf3adeefa9fde2c43e7",
    "content": "some content",
    "summary": "some summary,
    "uuid": "b3b09e2e-d9f9-4cc2-b29a-8c0b3d5cbbd4",
    "status": "completed"
}
```