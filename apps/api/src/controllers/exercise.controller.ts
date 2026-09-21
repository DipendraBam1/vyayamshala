import type { Request, Response } from "express";

import {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
} from "../services/exercise.service.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { db } from "../prisma/db.js";

export async function createExerciseController(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      name,
      description,
      muscleGroup,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Exercise name is required",
      });
    }

    // Find trainer profile belonging to logged-in user
    const trainer = await db.orm.public.Trainer
      .where({ userId: req.user.userId })
      .first();

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found",
      });
    }

    const exercise = await createExercise({
      trainerId: trainer.id,
      name,
      description,
      muscleGroup,
    });

    return res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      data: exercise,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create exercise",
    });
  }
}
export async function getExercisesController(
  _req: Request,
  res: Response,
) {
  try {
    const exercises = await getExercises();

    return res.status(200).json({
      success: true,
      data: exercises,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
    });
  }
}
export async function updateExerciseController(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exercise ID",
      });
    }

    const {
      name,
      description,
      muscleGroup,
    } = req.body;

    let trainerId: number | null = null;

    // Only trainers need ownership checking
    if (req.user.role === "TRAINER") {
      const trainer = await db.orm.public.Trainer
        .where({ userId: req.user.userId })
        .first();

      if (!trainer) {
        return res.status(404).json({
          success: false,
          message: "Trainer profile not found",
        });
      }

      trainerId = trainer.id;
    }

    const exercise = await updateExercise(
      id,
      trainerId,
      {
        name,
        description,
        muscleGroup,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      data: exercise,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update exercise",
    });
  }
}
export async function deleteExerciseController(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exercise ID",
      });
    }

    let trainerId: number | null = null;

    if (req.user.role === "TRAINER") {
      const trainer = await db.orm.public.Trainer
        .where({ userId: req.user.userId })
        .first();

      if (!trainer) {
        return res.status(404).json({
          success: false,
          message: "Trainer profile not found",
        });
      }

      trainerId = trainer.id;
    }

    const result = await deleteExercise(
      id,
      trainerId,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete exercise",
    });
  }
}