import type { Request, Response } from "express";

import {
  createTrainer,
  deleteTrainer,
  getTrainers,
  updateTrainer,
} from "../services/trainer.service.js";

export async function createTrainerController(
  req: Request,
  res: Response,
) {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialty,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const trainer = await createTrainer({
      name,
      email,
      password,
      phone,
      specialty,
      profileImage: req.file,
    });

    return res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      data: trainer,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create trainer",
    });
  }
}

export async function getTrainersController(
  _req: Request,
  res: Response,
) {
  try {
    const trainers = await getTrainers();

    return res.status(200).json({
      success: true,
      data: trainers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trainers",
    });
  }
}

export async function updateTrainerController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    const {
      name,
      email,
      phone,
      specialty,
    } = req.body;

    const trainer = await updateTrainer(id, {
      name,
      email,
      phone,
      specialty,
      profileImage: req.file,
    });

    return res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      data: trainer,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update trainer",
    });
  }
}

export async function deleteTrainerController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID",
      });
    }

    const result = await deleteTrainer(id);

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
          : "Failed to delete trainer",
    });
  }
}