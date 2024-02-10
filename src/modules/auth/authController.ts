import { generateJWT } from "../../shared/helpers/jwtHelper";
import { JOIN_ROOM } from "../../sockets/config";

class AuthController {
  constructor() {}

  async loginController(req: any, res: any) {
    const { user } = req.body;
    const io = req.app.get("io");

    try {
      const tokken = generateJWT(user.id, user.role);
      /*       io.emit(JOIN_ROOM, { userId: user.id, role: user.role }); */
      res.status(200).json({ user, tokken });
    } catch (error) {
      res.status(500).json({ error: "Internal server error to login - tray again or try later" });
    }
  }
}

export const authController = new AuthController();
