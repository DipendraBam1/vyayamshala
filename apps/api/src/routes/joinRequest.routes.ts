import { Router } from "express";

import {
  createJoinRequestController,
  getJoinRequestsController,
  deleteJoinRequestController,
} from "../controllers/joinRequest.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// Public
router.post("/", createJoinRequestController);

// Admin
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getJoinRequestsController,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteJoinRequestController,
);

export default router;