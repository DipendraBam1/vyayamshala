import { Router } from "express";
import multer from "multer";

import {
  getReviewsController,
  getMyReviewsController,
  createReviewController,
} from "../controllers/review.controller.js";

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
      callback(new Error("Only image files are allowed"));
    }
  },
});

// Public
router.get("/", getReviewsController);

// Member's own reviews
router.get(
  "/me",
  authenticate,
  authorize("MEMBER"),
  getMyReviewsController,
);

// Member creates review
router.post(
  "/",
  authenticate,
  authorize("MEMBER"),
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  createReviewController,
);

export default router;