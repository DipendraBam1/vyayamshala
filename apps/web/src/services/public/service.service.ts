import api from "../api";

export interface Service {
  id: number;
  name: string;
  icon: string;
}

export async function getServices(): Promise<Service[]> {
  const response = await api.get("/services");

  return response.data.data;
}

export async function createService(
  data: Omit<Service, "id">,
) {
  const response = await api.post("/services", data);

  return response.data.data;
}

export async function updateService(
  id: number,
  data: Omit<Service, "id">,
) {
  const response = await api.put(`/services/${id}`, data);

  return response.data.data;
}

export async function deleteService(id: number) {
  await api.delete(`/services/${id}`);
}