import { db } from "../prisma/db.js";

interface CreateMembershipData {
  memberId: number;
  planId: number;
  startDate: string;
  endDate: string;
}
interface UpdateMembershipData {
  planId?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export async function createMembership(
  data: CreateMembershipData,
) {
  const member = await db.orm.public.Member
    .where((member) => member.id.eq(data.memberId))
    .first();

  if (!member) {
    throw new Error("Member not found");
  }

  const plan = await db.orm.public.MembershipPlan
    .where((plan) => plan.id.eq(data.planId))
    .first();

  if (!plan) {
    throw new Error("Membership plan not found");
  }

  // Check if the member already has an active membership
  const existingMemberships =
    await db.orm.public.Membership
      .where((membership) =>
        membership.memberId.eq(data.memberId),
      )
      .all();

  const activeMembership =
    existingMemberships.find(
      (membership) =>
        membership.status === "ACTIVE",
    );

  if (activeMembership) {
    throw new Error(
      "Member already has an active membership.",
    );
  }

  // Create new membership
  const membership =
    await db.orm.public.Membership.create({
      memberId: data.memberId,
      planId: data.planId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "ACTIVE",
    });

  return membership;
}

export async function getMemberships(userId?: number) {
  let memberships;

  if (userId) {
    const member = await db.orm.public.Member
      .where((member) => member.userId.eq(userId))
      .first();

    if (!member) {
      throw new Error("Member profile not found");
    }

    memberships = await db.orm.public.Membership
      .where((membership) => membership.memberId.eq(member.id))
      .include("plan")
      .all();
  } else {
    memberships = await db.orm.public.Membership
      .include("member", (member) =>
        member.include("user", (user) =>
          user.select("id", "name", "email"),
        ),
      )
      .include("plan")
      .all();
  }

  // existing expiration logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const membership of memberships) {
    if (
      membership.status === "ACTIVE" &&
      new Date(membership.endDate) < today
    ) {
      await db.orm.public.Membership
        .where((item) => item.id.eq(membership.id))
        .update({
          status: "EXPIRED",
        });

      membership.status = "EXPIRED";
    }
  }

  return memberships;
}
export async function cancelMembership(id: number) {
  const membership = await db.orm.public.Membership
    .where((membership) => membership.id.eq(id))
    .first();

  if (!membership) {
    throw new Error("Membership not found");
  }

  if (membership.status === "EXPIRED") {
    throw new Error("Expired membership cannot be cancelled.");
  }

  if (membership.status === "CANCELLED") {
    throw new Error("Membership is already cancelled.");
  }

  return db.orm.public.Membership
    .where((membership) => membership.id.eq(id))
    .update({
      status: "CANCELLED",
    });
}
export async function updateMembership(
  id: number,
  data: UpdateMembershipData,
) {
  const membership = await db.orm.public.Membership
    .where({ id })
    .first();

  if (!membership) {
    throw new Error("Membership not found");
  }

  if (data.planId) {
    const plan = await db.orm.public.MembershipPlan
      .where({ id: data.planId })
      .first();

    if (!plan) {
      throw new Error("Membership plan not found");
    }
  }

  const updatedMembership = await db.orm.public.Membership
    .where({ id })
    .update({
      planId: data.planId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
    });

  if (!updatedMembership) {
    throw new Error("Membership not found");
  }

  return updatedMembership;
}
export async function deleteMembership(id: number) {
  const deletedMembership = await db.orm.public.Membership
    .where({ id })
    .delete();

  if (!deletedMembership) {
    throw new Error("Membership not found");
  }

  return {
    message: "Membership deleted successfully",
  };
}