class AuthController {
  constructor() {}

  async loginController(req: any, res: any) {
    res.status(200).json({ status: "ok" });
  }
}

export const authController = new AuthController();
