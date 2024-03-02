import cloudinary from "cloudinary";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
const fileUpload = require("express-fileupload");

import { dbConnection } from "./database/config";
import { BASE_URL_PORT, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "./shared/config/config";
import { CORS_CONFIG } from "./shared/config/corsConfig";

import authRoutes from "./modules/auth/authRoutes";
import menuRoutes from "./modules/menu/menuRoutes";
import orderRoutes from "./modules/order/orderRoutes";
import roleRoutes from "./modules/role/roleRoutes";
import seedRoutes from "./modules/seeds/seedRoutes";
import userRoutes from "./modules/user/userRoutes";
import { socketConnection } from "./sockets";

export class Server {
  private app: express.Application;
  private port: string;
  private httpServer: any;
  io: SocketIOServer;

  constructor() {
    this.app = express();
    this.port = BASE_URL_PORT as string;
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: CORS_CONFIG,
    });

    this.app.set("io", this.io);
    this.connectDataBase();
    this.middlewares();
    this.configureCloudinary();
    this.routes();
    this.configureSocketIO();
  }

  async connectDataBase() {
    await dbConnection();
  }

  public middlewares() {
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );
  }

  private configureCloudinary() {
    cloudinary.v2.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  private routes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/test", (req, res) => {
      res.send("hello")
    });
    this.app.use("/api/user", userRoutes);
    this.app.use("/api/role", roleRoutes);
    this.app.use("/api/order", orderRoutes);
    this.app.use("/api/menu", menuRoutes);
    this.app.use("/api/seed", seedRoutes);
  }

  configureSocketIO() {
    this.io.on("connection", socketConnection);
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}
