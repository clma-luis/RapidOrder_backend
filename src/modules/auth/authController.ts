import { INTERNAL_SERVER_ERROR_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";
import { generateJWT } from "../../shared/helpers/jwtHelper";
import { JOIN_ROOM } from "../../sockets/config";

class AuthController {
  constructor() {}

  async loginController(req: any, res: any) {
    const { user } = req.body;
    const io = req.app.get("io");

    try {
      const token = generateJWT(user.id, user.role);
      /*       io.emit(JOIN_ROOM, { userId: user.id, role: user.role }); */
      res.status(OK_STATUS).json({ user, token });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error to login - tray again or try later" });
    }
  }
}

export const authController = new AuthController();
