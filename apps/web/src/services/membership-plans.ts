
import api from "./api";

export interface MembershipPlan {
  id: number;
  name: string;
  duration: number;
  durationUnit: "DAY" | "WEEK" | "MONTH" | "YEAR";
  price: string;
  description: string | null;
}

export interface CreateMembershipPlanData {
  name: string;
  duration: number;
  durationUnit: "WEEK" | "MONTH" | "YEAR";
  price: number;
  description?: string;
}

export interface UpdateMembershipPlanData {
  name: string;
  duration: number;
  durationUnit: "WEEK" | "MONTH" | "YEAR";
  price: number;
  description?: string;
}

export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  const response = await api.get("/membership-plans");

  return response.data.data;
}

export async function createMembershipPlan(
  data: CreateMembershipPlanData,
) {
  const response = await api.post("/membership-plans", data);

  return response.data;
}

export async function updateMembershipPlan(
  id: number,
  data: UpdateMembershipPlanData,
) {
  const response = await api.put(
    `/membership-plans/${id}`,
    data,
  );

  return response.data;
}

export async function deleteMembershipPlan(id: number) {
  const response = await api.delete(`/membership-plans/${id}`);
  return response.data;
}