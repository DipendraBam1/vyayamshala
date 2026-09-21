import type { Request, Response } from "express";

import {
  createDietPlan,
  getDietPlans,
  updateDietPlan,
  deleteDietPlan,
} from "../services/dietplan.service";
import { db } from "../prisma/db";
import { AuthRequest } from "../middlewares/auth.middleware";

export async function createDietPlanController(
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
      calories,
      protein,
      carbs,
      fats,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Diet plan name is required",
      });
    }

    // Find trainer from logged-in user
    const trainer = await db.orm.public.Trainer
      .where({ userId: req.user.userId })
      .first();

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found",
      });
    }

    const dietPlan = await createDietPlan({
      trainerId: trainer.id,
      name,
      description,
      calories: calories !== undefined
        ? Number(calories)
        : undefined,
      protein: protein !== undefined
        ? String(protein)
        : undefined,
      carbs: carbs !== undefined
        ? String(carbs)
        : undefined,
      fats: fats !== undefined
        ? String(fats)
        : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Diet plan created successfully",
      data: dietPlan,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create diet plan",
    });
  }
}
export async function getDietPlansController(
  _req: Request,
  res: Response,
) {
  try {
    const dietPlans = await getDietPlans();

    return res.status(200).json({
      success: true,
      data: dietPlans,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch diet plans",
    });
  }
}
export async function updateDietPlanController(
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
        message: "Invalid diet plan ID",
      });
    }

    const {
      name,
      description,
      calories,
      protein,
      carbs,
      fats,
    } = req.body;

    let trainerId: number | null = null;

    // Trainer can update only their own plans
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

    const dietPlan = await updateDietPlan(id, trainerId, {
      name,
      description,
      calories: calories !== undefined
        ? Number(calories)
        : undefined,
      protein: protein !== undefined
        ? String(protein)
        : undefined,
      carbs: carbs !== undefined
        ? String(carbs)
        : undefined,
      fats: fats !== undefined
        ? String(fats)
        : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Diet plan updated successfully",
      data: dietPlan,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update diet plan",
    });
  }
}
export async function deleteDietPlanController(
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
        message: "Invalid diet plan ID",
      });
    }

    let trainerId: number | null = null;

    // Trainer can delete only their own plans
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

    const result = await deleteDietPlan(id, trainerId);

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
          : "Failed to delete diet plan",
    });
  }
}