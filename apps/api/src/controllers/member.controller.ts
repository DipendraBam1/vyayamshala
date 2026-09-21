import type { Request, Response } from "express";
import { createMember, deleteMember, getMembers, updateMember } from "../services/member.service.js";

export async function createMemberController(
  req: Request,
  res: Response,
) {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const member = await createMember({
      name,
      email,
      password,
      phone,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: member,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create member",
    });
  }
}
export async function getMembersController(
  _req: Request,
  res: Response,
) {
  try {
    const members = await getMembers();

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
}
export async function updateMemberController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const {
      name,
      email,
      phone,
      address,
    } = req.body;

    const member = await updateMember(id, {
      name,
      email,
      phone,
      address,
    });

    return res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: member,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update member",
    });
  }
}
export async function deleteMemberController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const result = await deleteMember(id);

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
          : "Failed to delete member",
    });
  }
}