import api from "../api";

 
export interface MemberMembership {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  plan: {
    id: number;
    name: string;
    duration: number;
    durationUnit: string;
    price: string;
    description: string | null;
  };
}

export async function getMyMembership(): Promise<MemberMembership | null> {
  const response = await api.get("/memberships/me");

  if (!response.data.data) {
    return null;
  }

  return response.data.data[0] ?? null;
}