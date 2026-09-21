import api from "./api";

export interface Membership {
  id: number;
  memberId: number;
  planId: number;
  startDate: string;
  endDate: string;
  status: string;

  member: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };

  plan: {
    id: number;
    name: string;
    duration: number;
    price: string;
  };
}

export interface CreateMembershipData {
  memberId: number;
  planId: number;
  startDate: string;
  endDate: string;
  status?: string;
}

export async function getMemberships(): Promise<Membership[]> {
  const response = await api.get("/memberships");

  return response.data.data;
}

export async function createMembership(
  data: CreateMembershipData,
) {
  const response = await api.post("/memberships", data);

  return response.data;
}

export async function updateMembership(
  id: number,
  data: CreateMembershipData,
) {
  const response = await api.put(`/memberships/${id}`, data);

  return response.data;
}
export async function cancelMembership(id: number) {
  const response = await api.patch(`/memberships/${id}/cancel`);
  return response.data;
}