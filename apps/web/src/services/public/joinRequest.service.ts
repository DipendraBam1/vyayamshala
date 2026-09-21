import api from "../api";

 
export interface JoinRequest {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
}

export async function createJoinRequest(
  name: string,
  phone: string,
) {
  const response = await api.post("/join-requests", {
    name,
    phone,
  });

  return response.data.data;
}

export async function getJoinRequests(): Promise<JoinRequest[]> {
  const response = await api.get("/join-requests");

  return response.data.data;
}

export async function deleteJoinRequest(id: number) {
  const response = await api.delete(
    `/join-requests/${id}`,
  );

  return response.data;
}