import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { db } from "../prisma/db.js";

import {
  checkIn,
  checkOut,
  getAttendance,
  getMemberAttendance,
} from "../services/attendence.service.js";

export async function checkInController(
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

    const member = await db.orm.public.Member
      .where({ userId: req.user.userId })
      .first();

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    const attendance = await checkIn(member.id);

    return res.status(201).json({
      success: true,
      message: "Checked in successfully",
      data: attendance,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to check in",
    });
  }
}
export async function checkOutController(
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

    const member = await db.orm.public.Member
      .where({ userId: req.user.userId })
      .first();

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    const attendance = await checkOut(member.id);

    return res.status(200).json({
      success: true,
      message: "Checked out successfully",
      data: attendance,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to check out",
    });
  }
}
export async function getAttendanceController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const attendance = await getAttendance();

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
}
export async function getMyAttendanceController(
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

    const member = await db.orm.public.Member
      .where({ userId: req.user.userId })
      .first();

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    const attendance = await getMemberAttendance(member.id);

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your attendance",
    });
  }
}