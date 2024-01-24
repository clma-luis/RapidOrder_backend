import express from "express";
import cors from "cors";

import { dbConnection } from "./database/config";
import { BASE_URL_PORT } from "./shared/constants/config";

import userRoutes from "./modules/user/userRoutes";
import roleRoutes from "./modules/role/roleRoutes";
import orderRoutes from "./modules/order/orderRoutes";
import menuRoutes from "./modules/menu/menuRoutes";
import seedRoutes from "./modules/seeds/seedRoutes";

export class Server {
  private app: express.Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = BASE_URL_PORT as string;
    this.connectDataBase();
    this.middlewares();
    this.routes();
  }

  async connectDataBase() {
    await dbConnection();
  }

  public middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes() {
    this.app.use("/api/user", userRoutes);
    this.app.use("/api/role", roleRoutes);
    this.app.use("/api/order", orderRoutes);
    this.app.use("/api/menu", menuRoutes);
    this.app.use("/api/seed", seedRoutes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}
