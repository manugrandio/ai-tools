import express, { Express, RequestHandler } from "express";
import routes from "../routes";

export function setupServer(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", routes as RequestHandler);

  return app;
}

