import { Router } from "express";
import {
  createPlan,
  getPlans,
    updatePlan,
  deletePlan,
} from "../controllers/membershipplan.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "TRAINER", "MEMBER"),
  getPlans,
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createPlan,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updatePlan,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deletePlan,
);
export default router;