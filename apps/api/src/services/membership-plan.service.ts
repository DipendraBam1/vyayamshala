
import { db } from "../prisma/db.js";

type DurationUnit = "WEEK" | "MONTH" | "YEAR";

interface CreatePlanData {
  name: string;
  duration: number;
  durationUnit: DurationUnit;
  price: string;
  description?: string;
}

export async function createMembershipPlan(
  data: CreatePlanData,
) {
  const existingPlan =
    await db.orm.public.MembershipPlan
      .where((plan) => plan.name.eq(data.name))
      .first();

  if (existingPlan) {
    throw new Error("Membership plan already exists");
  }

  const plan =
    await db.orm.public.MembershipPlan.create({
      name: data.name,
      duration: data.duration,
      durationUnit: data.durationUnit,
      price: data.price,
      description: data.description,
    });

  return plan;
}

export async function getMembershipPlans() {
  return db.orm.public.MembershipPlan
    .select(
      "id",
      "name",
      "duration",
      "durationUnit",
      "price",
      "description",
      "createdAt",
      "updatedAt",
    )
    .all();
}

interface UpdatePlanData {
  name?: string;
  duration?: number;
  durationUnit?: DurationUnit;
  price?: string;
  description?: string;
}

export async function updateMembershipPlan(
  id: number,
  data: UpdatePlanData,
) {
  const updatedPlan =
    await db.orm.public.MembershipPlan
      .where((plan) => plan.id.eq(id))
      .update(data);

  if (!updatedPlan) {
    throw new Error("Membership plan not found");
  }

  return updatedPlan;
}

export async function deleteMembershipPlan(id: number) {
  const plan = await db.orm.public.MembershipPlan
    .where((plan) => plan.id.eq(id))
    .first();

  if (!plan) {
    throw new Error("Membership plan not found");
  }

  const memberships = await db.orm.public.Membership
    .where((membership) => membership.planId.eq(id))
    .all();

  if (memberships.length > 0) {
    throw new Error(
      "Cannot delete this plan because it is assigned to a member.",
    );
  }

  await db.orm.public.MembershipPlan
    .where((plan) => plan.id.eq(id))
    .delete();

  return {
    message: "Membership plan deleted successfully",
  };
}

