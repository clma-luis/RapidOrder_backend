// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");
import { JWT_SECRET } from "../config/config";

export const generateJWT = (userId: string, role: string) => {
  if (!userId) return;
  return jwt.sign({ userId, role }, JWT_SECRET /* , { expiresIn: "2h" } */);
};
