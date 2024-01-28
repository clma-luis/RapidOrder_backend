import mongoose from "mongoose";
import { MONGO_CONNECTION_URL } from "../shared/config/config";
export const dbConnection = async () => {
  const pathConnection = MONGO_CONNECTION_URL as string;
  try {
    await mongoose.connect(pathConnection);
    console.log("base de datos online");
  } catch (error) {
    throw new Error(`Error a la hora de iniciar la base de datos: ${error}`);
  }
};
