import { Router } from "express";

  
import {
  createExerciseController,
  getExercisesController,
  updateExerciseController,
  deleteExerciseController,
} from "../controllers/exercise.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// Trainer + Admin can view
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "TRAINER", "MEMBER"),
  getExercisesController,
);

// Trainer + Admin can create
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "TRAINER"),
  createExerciseController,
);

// Trainer + Admin can update
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "TRAINER"),
  updateExerciseController,
);

// Trainer + Admin can delete
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "TRAINER"),
  deleteExerciseController,
);

export default router;