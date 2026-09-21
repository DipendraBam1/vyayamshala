import { Router } from "express";

 
import {
  checkInController,
  checkOutController,
  getAttendanceController,
  getMyAttendanceController,
} from "../controllers/attendence.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// Admin → view all attendance
router.get(
  "/",
  authenticate,
  authorize("ADMIN","TRAINER"),
  getAttendanceController,
);

// Member → view own attendance
router.get(
  "/my",
  authenticate,
  authorize("MEMBER"),
  getMyAttendanceController,
);

// Member → check in
router.post(
  "/check-in",
  authenticate,
  authorize("MEMBER"),
  checkInController,
);

// Member → check out
router.post(
  "/check-out",
  authenticate,
  authorize("MEMBER"),
  checkOutController,
);

export default router;