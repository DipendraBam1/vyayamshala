import type { Request, Response } from "express";

import {
  createJoinRequest,
  getJoinRequests,
  deleteJoinRequest,
} from "../services/joinRequest.service.js";

export async function createJoinRequestController(
  req: Request,
  res: Response,
) {
  try {
    const { name, phone } = req.body;

    const joinRequest = await createJoinRequest({
      name,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Your request has been submitted",
      data: joinRequest,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit request",
    });
  }
}

export async function getJoinRequestsController(
  _req: Request,
  res: Response,
) {
  try {
    const requests = await getJoinRequests();

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch join requests",
    });
  }
}

export async function deleteJoinRequestController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    await deleteJoinRequest(id);

    return res.status(200).json({
      success: true,
      message: "Join request deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete request",
    });
  }
}