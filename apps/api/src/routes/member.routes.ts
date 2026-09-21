import { Router } from "express";
import { createMemberController, deleteMemberController, getMembersController, updateMemberController } from "../controllers/member.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createMemberController,
);
router.get(
  "/",
  authenticate,
  authorize("ADMIN","TRAINER"),
  getMembersController,
);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateMemberController,
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteMemberController,
);
export default router;