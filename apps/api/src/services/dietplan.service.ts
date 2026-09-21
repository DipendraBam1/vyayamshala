import { db } from "../prisma/db.js";

interface CreateDietPlanData {
  trainerId: number;
  name: string;
  description?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fats?: string;
}

export async function createDietPlan(data: CreateDietPlanData) {
  // Check trainer exists
  const trainer = await db.orm.public.Trainer
    .where({ id: data.trainerId })
    .first();

  if (!trainer) {
    throw new Error("Trainer not found");
  }

  // Check duplicate diet plan
  const existingPlan = await db.orm.public.DietPlan
    .where((plan) => plan.name.eq(data.name))
    .first();

  if (existingPlan) {
    throw new Error("Diet plan already exists");
  }

  return db.orm.public.DietPlan.create({
    trainerId: data.trainerId,
    name: data.name,
    description: data.description,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fats: data.fats,
  });
}

export async function getDietPlans() {
  return db.orm.public.DietPlan
    .include("trainer", (trainer) =>
      trainer
        .include("user", (user) =>
          user.select("id", "name", "email")
        )
    )
    .all();
}

interface UpdateDietPlanData {
  name?: string;
  description?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fats?: string;
}

export async function updateDietPlan(
  id: number,
  trainerId: number | null,
  data: UpdateDietPlanData,
) {
  const plan = await db.orm.public.DietPlan
    .where({ id })
    .first();

  if (!plan) {
    throw new Error("Diet plan not found");
  }

  // If trainer is editing, make sure this plan belongs to them
  if (trainerId !== null && plan.trainerId !== trainerId) {
    throw new Error("You can only update your own diet plans");
  }

  const updatedPlan = await db.orm.public.DietPlan
    .where({ id })
    .update({
      name: data.name,
      description: data.description,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fats: data.fats,
    });

  if (!updatedPlan) {
    throw new Error("Diet plan not found");
  }

  return updatedPlan;
}

export async function deleteDietPlan(
  id: number,
  trainerId: number | null,
) {
  const plan = await db.orm.public.DietPlan
    .where({ id })
    .first();

  if (!plan) {
    throw new Error("Diet plan not found");
  }

  // Trainer can delete only their own plan
  if (trainerId !== null && plan.trainerId !== trainerId) {
    throw new Error("You can only delete your own diet plans");
  }

  await db.orm.public.DietPlan
    .where({ id })
    .delete();

  return {
    message: "Diet plan deleted successfully",
  };
}