import { Router } from "express";

import { upload } from "../middlewares/upload";
import { checkAuthenticatedUsers } from "../middlewares/checkAuthenticatedUsers";
import {
  getAllProperties,
  getSingleProperty,
} from "../controllers/property_controllers/getproperty.controller";
import { createProperty } from "../controllers/property_controllers/createproperty.controller";
import { updateProperty } from "../controllers/property_controllers/updateproperty.controller";
import { deleteProperty } from "../controllers/property_controllers/deleteproperty.controller";

const router: Router = Router();

router.get("/", getAllProperties);
router.get("/id", getSingleProperty);

router.post(
  "/",
  checkAuthenticatedUsers,
  upload.single("propertyImage"),
  createProperty
);
router.put(
  "/id",
  checkAuthenticatedUsers,
  upload.single("propertyImage"),
  updateProperty
);
router.delete("/id", checkAuthenticatedUsers, deleteProperty);

export default router;
