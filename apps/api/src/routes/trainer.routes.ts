import { Router } from "express";
import multer from "multer";

import {
  createTrainerController,
  getTrainersController,
  updateTrainerController,
  deleteTrainerController,
} from "../controllers/trainer.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(
        new Error("Only image files are allowed"),
      );
    }
  },
});

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getTrainersController,
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.single("profileImage"),
  createTrainerController,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.single("profileImage"),
  updateTrainerController,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteTrainerController,
);

export default router;