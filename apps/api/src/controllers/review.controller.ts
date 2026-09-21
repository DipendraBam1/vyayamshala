import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

import {
  createReview,
  getReviews,
  getMyReviews,
} from "../services/review.service.js";

export async function getReviewsController(
  _req: AuthRequest,
  res: Response,
) {
  try {
    const reviews = await getReviews();

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
}

export async function getMyReviewsController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const reviews = await getMyReviews(req.user!.userId);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your reviews",
    });
  }
}

export async function createReviewController(
  req: AuthRequest,
  res: Response,
) {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

     const { review, rating } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const image1 = files?.image1?.[0];
    const image2 = files?.image2?.[0];

    const newReview = await createReview({
      userId: req.user!.userId,
      review,
      rating: Number(rating),
      image1,
      image2,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit review",
    });
  }
}