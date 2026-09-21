import { Router } from "express";

  
import {
  createDietPlanController,
  getDietPlansController,
  updateDietPlanController,
  deleteDietPlanController,
} from "../controllers/dietplan.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// ADMIN + TRAINER + MEMBER can view
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "TRAINER", "MEMBER"),
  getDietPlansController,
);

// ADMIN + TRAINER can create
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "TRAINER"),
  createDietPlanController,
);

// ADMIN + TRAINER can update
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "TRAINER"),
  updateDietPlanController,
);

// ADMIN + TRAINER can delete
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "TRAINER"),
  deleteDietPlanController,
);

export default router;