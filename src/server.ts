import cloudinary from "cloudinary";
import cors from "cors";
import express from "express";
const fileUpload = require("express-fileupload");
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

import { dbConnection } from "./database/config";
import { BASE_URL_PORT, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "./shared/config/config";

import authRoutes from "./modules/auth/authRoutes";
import menuRoutes from "./modules/menu/menuRoutes";
import orderRoutes from "./modules/order/orderRoutes";
import roleRoutes from "./modules/role/roleRoutes";
import seedRoutes from "./modules/seeds/seedRoutes";
import userRoutes from "./modules/user/userRoutes";

export class Server {
  private app: express.Application;
  private port: string;
  private httpServer: any;
  private io: SocketIOServer;

  constructor() {
    this.app = express();
    this.port = BASE_URL_PORT as string;
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer);

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
    this.app.use("/api/user", userRoutes);
    this.app.use("/api/role", roleRoutes);
    this.app.use("/api/order", orderRoutes);
    this.app.use("/api/menu", menuRoutes);
    this.app.use("/api/seed", seedRoutes);
  }

  configureSocketIO() {
    console.log("Socket.io initialized");
    this.io.on("connection", (socket: Socket) => {
      console.log("Socket connected: ", socket.id);
      console.log("A user connected");

      // Configurar CORS específicamente para Socket.IO
      const corsOptions = {
        origin: "http://localhost:3000", // Reemplaza con la URL correcta de tu aplicación cliente
        accept: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["my-custom-header"],
      };

      const ioWithCORS = new SocketIOServer(this.httpServer, {
        cors: corsOptions,
      });

      // Ahora usar ioWithCORS en lugar de this.io
      ioWithCORS.on("connection", (socket: Socket) => {
        // ... Resto del código ...
        console.log("Socket connected: ", socket.id);
      });

      // Resto del código...
    });
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}
