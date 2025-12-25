import { Router, Response } from "express";

import { register } from "../controllers/auth_controllers/auth.controller";
import { login } from "../controllers/auth_controllers/login.controller";
import { upload } from "../middlewares/upload";
import {
  AuthenticationRequest,
  checkAuthenticatedUsers,
} from "../middlewares/checkAuthenticatedUsers";

const router: Router = Router();

router.post("/register", upload.single("idCard"), register);
router.post("/login", login);

router.get(
  "/user",
  checkAuthenticatedUsers,
  (req: AuthenticationRequest, res: Response) => {
    res.json({
      message: "This is the user's private route",
      email: req.user?.email,
    });
  }
);

export default router;
