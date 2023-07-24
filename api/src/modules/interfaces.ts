import { Request } from "express";

interface CreateBody {
  content: string;
}

export interface RequestCreate extends Request {
  body: CreateBody;
}

interface UpdateBody extends Request {
  summary: string;
  status: string;
}

export interface RequestUpdate extends Request {
  body: UpdateBody;
}
