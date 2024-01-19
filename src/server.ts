import express from "express";
import { BASE_URL_PORT } from "./shared/constants/config";

export class Server {
  private app: express.Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = BASE_URL_PORT as string;

    this.middlewares();
    this.routes();
  }

  public middlewares() {
    this.app.use(express.static("public"));
  }

  private routes() {
    this.app.get("/", (req, res) => {
      res.json({ text: "Get, TypeScript with Express in the Server class!", status: 200 });
    });
    this.app.put("/", (req, res) => {
      res.json({ text: "Put, TypeScript with Express in the Server class!", status: 200 });
    });
    this.app.post("/", (req, res) => {
      res.json({ text: "Post, TypeScript with Express in the Server class!", status: 200 });
    });
    this.app.delete("/", (req, res) => {
      res.json({ text: "delete, TypeScript with Express in the Server class!", status: 200 });
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}
