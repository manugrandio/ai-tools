import { Response } from "express";
import http from "http";
import dataSource from "orm/orm.config";
import { setupServer } from "server/server";

async function bootstrap(): Promise<http.Server> {
  const app = setupServer();

  const port = process.env.APP_PORT;
  await dataSource.initialize();

  app.get("/", (_, res: Response) => {
    res.send(`Listening on port: ${port}`);
  });

  const server = http.createServer(app);
  server.listen(port);

  return server;
}

bootstrap();

