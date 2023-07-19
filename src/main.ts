import config from "./config/config"
import { Response } from "express";
import http from "http";
import { setupServer } from "./server/server";

const dummyORM = () => {
  return new Promise<void>(resolve => resolve());
}

async function bootstrap(): Promise<http.Server> {
  const app = setupServer();

  const port = config.APP_PORT;
  await dummyORM();

  app.get("/", (_, res: Response) => {
    res.send(`Listening on port: ${port}`);
  });

  const server = http.createServer(app);
  server.listen(port);

  return server;
}

bootstrap();

