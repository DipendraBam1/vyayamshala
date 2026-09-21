import { Router } from "express";

import {
  createMembershipController,
  getMembershipsController,
  updateMembershipController,
  deleteMembershipController,
  cancelMembershipController,
} from "../controllers/membership.controller.js";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// Get all memberships
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getMembershipsController,
);
router.get(
  "/me",
  authenticate,
  authorize("MEMBER"),
  getMembershipsController,
);
// Create membership
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createMembershipController,
);

// Update membership
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateMembershipController,
);
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("ADMIN"),
  cancelMembershipController,
);
// Delete membership
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteMembershipController,
);

export default router;