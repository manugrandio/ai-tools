import { Router, RequestHandler, Request, Response } from "express";

const helloWorld = (_: Request, res: Response) => {
  res.status(201).send({ "msg": "hello world" });
};

const routes = Router();

routes.get("/hello-world", helloWorld as RequestHandler);

export default routes;
