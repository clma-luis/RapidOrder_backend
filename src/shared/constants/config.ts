import * as dotenv from "dotenv";
dotenv.config();

export const BASE_URL_PORT = process.env.PORT;
export const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
