import * as dotenv from "dotenv";
dotenv.config();

export const BASE_URL_PORT = process.env.PORT;
export const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
export const JWT_SECRET = process.env.JWT_SECRET;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

export const CLOUDINARY_URL_IMAGE_BASE = process.env.CLOUDINARY_URL_IMAGE_BASE;
