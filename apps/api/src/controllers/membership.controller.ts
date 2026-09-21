import type { Request, Response } from "express";
import {
  createMembership,
  getMemberships,
  updateMembership,
  deleteMembership,
  cancelMembership,
} from "../services/membership.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
export async function createMembershipController(
  req: Request,
  res: Response,
) {
  try {
    const {
      memberId,
      planId,
      startDate,
      endDate,
    } = req.body;

    if (
      !memberId ||
      !planId ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Member, plan, start date and end date are required",
      });
    }

    const membership = await createMembership({
      memberId: Number(memberId),
      planId: Number(planId),
      startDate,
      endDate,
    });

    return res.status(201).json({
      success: true,
      message: "Membership created successfully",
      data: membership,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create membership",
    });
  }
}
export async function getMembershipsController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const userId =
      req.user?.role === "MEMBER"
        ? req.user.userId
        : undefined;

    const memberships = await getMemberships(userId);

    return res.status(200).json({
      success: true,
      data: memberships,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch memberships",
    });
  }
}
export async function updateMembershipController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership ID",
      });
    }

    const {
      planId,
      startDate,
      endDate,
      status,
    } = req.body;

    const membership = await updateMembership(id, {
      planId: planId !== undefined
        ? Number(planId)
        : undefined,
      startDate,
      endDate,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Membership updated successfully",
      data: membership,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update membership",
    });
  }
}
export async function cancelMembershipController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership ID",
      });
    }

    const membership = await cancelMembership(id);

    return res.status(200).json({
      success: true,
      message: "Membership cancelled successfully",
      data: membership,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to cancel membership",
    });
  }
}
export async function deleteMembershipController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership ID",
      });
    }

    const result = await deleteMembership(id);

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
          : "Failed to delete membership",
    });
  }
}