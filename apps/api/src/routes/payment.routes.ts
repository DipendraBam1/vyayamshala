import { Router } from "express";
  
import {
  createPaymentController,
  getPaymentsController,
  updatePaymentController,
} from "../controllers/payment.controller.js";
import { authorize } from "../middlewares/role.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getPaymentsController,
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createPaymentController,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updatePaymentController,
);

export default router;