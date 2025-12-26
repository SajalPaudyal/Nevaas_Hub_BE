import { Router } from "express";
import { checkAuthenticatedUsers } from "../middlewares/checkAuthenticatedUsers";
import { checkAdmin } from "../middlewares/checkAdmin";
import { verifyUser } from "../controllers/auth_controllers/adminverification.controller";

const router: Router = Router();

router.patch("/verify-user", checkAuthenticatedUsers, checkAdmin, verifyUser);

export default router;