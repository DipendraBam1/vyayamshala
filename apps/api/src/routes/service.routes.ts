import { Router } from "express";

import {
  getServicesController,
  createServiceController,
  updateServiceController,
  deleteServiceController,
} from "../controllers/service.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// Public → view services
router.get(
  "/",
  getServicesController,
);

// Admin → create
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createServiceController,
);

// Admin → update
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateServiceController,
);

// Admin → delete
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteServiceController,
);

export default router;