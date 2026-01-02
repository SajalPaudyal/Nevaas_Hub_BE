import { Router } from "express";
import { checkAuthenticatedUsers } from "../middlewares/checkAuthenticatedUsers";
import {
  applyForProperty,
  applyForRoommate,
} from "../controllers/application_controllers/application.controller";

const router: Router = Router();

router.use(checkAuthenticatedUsers);

router.post("/property", applyForProperty);
router.post("/roommate", applyForRoommate);

export default router;
