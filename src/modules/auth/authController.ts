import { generateJWT } from "../../shared/helpers/jwtHelper";

class AuthController {
  constructor() {}

  async loginController(req: any, res: any) {
    const { user } = req.body;
    const tokken = generateJWT(user.id, user.role);
    res.status(200).json({ user, tokken });
  }
}

export const authController = new AuthController();
