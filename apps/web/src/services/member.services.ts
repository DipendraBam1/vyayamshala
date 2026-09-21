import api from "./api";

export interface Member {
  id: number;
  phone: string | null;
  address: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    role: "MEMBER";
  };
}

export interface CreateMemberData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface UpdateMemberData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export async function getMembers(): Promise<Member[]> {
  const response = await api.get("/members");
  return response.data.data;
}

export async function createMember(data: CreateMemberData) {
  const response = await api.post("/members", data);
  return response.data;
}

export async function updateMember(
  id: number,
  data: UpdateMemberData,
) {
  const response = await api.put(`/members/${id}`, data);
  return response.data;
}
export async function deleteMember(id: number) {
  const response = await api.delete(`/members/${id}`);
  return response.data;
}