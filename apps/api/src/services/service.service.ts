import { db } from "../prisma/db.js";

interface CreateServiceData {
  name: string;
  icon: string;
}

interface UpdateServiceData {
  name?: string;
  icon?: string;
}

export async function createService(data: CreateServiceData) {
  const existingService = await db.orm.public.Service
    .where((service) => service.name.eq(data.name))
    .first();

  if (existingService) {
    throw new Error("Service already exists");
  }

  return db.orm.public.Service.create({
    name: data.name,
    icon: data.icon,
  });
}

export async function getServices() {
  return db.orm.public.Service
    .select(
      "id",
      "name",
      "icon",
      "createdAt",
      "updatedAt",
    )
    .all();
}

export async function updateService(
  id: number,
  data: UpdateServiceData,
) {
  const service = await db.orm.public.Service
    .where({ id })
    .first();

  if (!service) {
    throw new Error("Service not found");
  }

  return db.orm.public.Service
    .where({ id })
    .update({
      name: data.name,
      icon: data.icon,
    });
}

export async function deleteService(id: number) {
  const service = await db.orm.public.Service
    .where({ id })
    .first();

  if (!service) {
    throw new Error("Service not found");
  }

  await db.orm.public.Service
    .where({ id })
    .delete();

  return {
    message: "Service deleted successfully",
  };
}