import { Router } from "express";
import { upload } from "../middlewares/upload";
import { checkAuthenticatedUsers } from "../middlewares/checkAuthenticatedUsers";
import { createRoommateOpening } from "../controllers/roommate_controllers/createroommate.controller";
import { updateRoommateOpening } from "../controllers/roommate_controllers/updateroommate.controller";
import { deleteRoommateOpening } from "../controllers/roommate_controllers/deleteroommate.controller";
import {
  getAllRoommateOpenings,
  getSingleRoommateOpening,
} from "../controllers/roommate_controllers/getroommate.controller";

const router: Router = Router();

router.get("/", getAllRoommateOpenings);
router.get("/:id", getSingleRoommateOpening);
router.post(
  "/",
  checkAuthenticatedUsers,
  upload.single("roommateOpeningImage"),
  createRoommateOpening
);
router.put(
  "/:id",
  checkAuthenticatedUsers,
  upload.single("roommateOpeningImage"),
  updateRoommateOpening
);
router.delete("/:id", checkAuthenticatedUsers, deleteRoommateOpening);

export default router;
