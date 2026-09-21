import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

import {
  createService,
  getServices,
  updateService,
  deleteService,
} from "../services/service.service.js";

export async function getServicesController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const services = await getServices();

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
}

export async function createServiceController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const { name, icon } = req.body;

    if (!name || !icon) {
      return res.status(400).json({
        success: false,
        message: "Name and icon are required",
      });
    }

    const service = await createService({
      name,
      icon,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create service",
    });
  }
}

export async function updateServiceController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const id = Number(req.params.id);
    const { name, icon } = req.body;

    const service = await updateService(id, {
      name,
      icon,
    });

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update service",
    });
  }
}

export async function deleteServiceController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    const result = await deleteService(id);

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
          : "Failed to delete service",
    });
  }
}