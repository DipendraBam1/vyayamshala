
import type { Request, Response } from "express";

import {
  createMembershipPlan,
  deleteMembershipPlan,
  getMembershipPlans,
  updateMembershipPlan,
} from "../services/membership-plan.service.js";

type DurationUnit = "DAY" | "WEEK" | "MONTH" | "YEAR";

const allowedDurationUnits: DurationUnit[] = [
  "DAY",
  "WEEK",
  "MONTH",
  "YEAR",
];

export async function createPlan(
  req: Request,
  res: Response,
) {
  try {
    const {
      name,
      duration,
      durationUnit,
      price,
      description,
    } = req.body;

    if (
      !name ||
      duration === undefined ||
      !durationUnit ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, duration, duration unit and price are required",
      });
    }

    if (
      !allowedDurationUnits.includes(
        durationUnit,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Duration unit must be DAY, WEEK, MONTH or YEAR",
      });
    }

    const plan =
      await createMembershipPlan({
        name,
        duration: Number(duration),
        durationUnit,
        price: String(price),
        description,
      });

    return res.status(201).json({
      success: true,
      message:
        "Membership plan created successfully",
      data: plan,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create plan",
    });
  }
}

export async function getPlans(
  _req: Request,
  res: Response,
) {
  try {
    const plans = await getMembershipPlans();

    return res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch membership plans",
    });
  }
}

export async function updatePlan(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    const {
      name,
      duration,
      durationUnit,
      price,
      description,
    } = req.body;

    if (
      durationUnit !== undefined &&
      !allowedDurationUnits.includes(
        durationUnit,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Duration unit must be WEEK, MONTH or YEAR",
      });
    }

    const plan =
      await updateMembershipPlan(id, {
        name,
        duration:
          duration !== undefined
            ? Number(duration)
            : undefined,
        durationUnit,
        price:
          price !== undefined
            ? String(price)
            : undefined,
        description,
      });

    return res.status(200).json({
      success: true,
      message:
        "Membership plan updated successfully",
      data: plan,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update plan",
    });
  }
}

export async function deletePlan(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    const result =
      await deleteMembershipPlan(id);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete plan",
    });
  }
}

