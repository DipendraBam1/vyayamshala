import { db } from "../prisma/db.js";

interface CreateJoinRequestData {
  name: string;
  phone: string;
}

export async function createJoinRequest(
  data: CreateJoinRequestData,
) {
  if (!data.name.trim()) {
    throw new Error("Name is required");
  }

  if (!data.phone.trim()) {
    throw new Error("Phone number is required");
  }

  return db.orm.public.JoinRequest.create({
    name: data.name.trim(),
    phone: data.phone.trim(),
  });
}

export async function getJoinRequests() {
  return db.orm.public.JoinRequest
    .select(
      "id",
      "name",
      "phone",
      "createdAt",
      "updatedAt",
    )
    .all();
}

export async function deleteJoinRequest(id: number) {
  const request = await db.orm.public.JoinRequest
    .where({ id })
    .first();

  if (!request) {
    throw new Error("Join request not found");
  }

  await db.orm.public.JoinRequest
    .where({ id })
    .delete();

  return {
    message: "Join request deleted successfully",
  };
}