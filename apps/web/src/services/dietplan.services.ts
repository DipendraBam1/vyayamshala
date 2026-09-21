import api from "./api";

export interface DietPlan {
  id: number;
  name: string;
  description: string | null;
  calories: number | null;
  protein: string | null;
  carbs: string | null;
  fats: string | null;
  trainer?: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface CreateDietPlanData {
  name: string;
  description?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fats?: string;
}

export interface UpdateDietPlanData {
  name?: string;
  description?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fats?: string;
}

export async function getDietPlans(): Promise<DietPlan[]> {
  const response = await api.get("/diet-plans");
  return response.data.data;
}

export async function createDietPlan(data: CreateDietPlanData) {
  const response = await api.post("/diet-plans", data);
  return response.data;
}

export async function updateDietPlan(
  id: number,
  data: UpdateDietPlanData,
) {
  const response = await api.put(`/diet-plans/${id}`, data);
  return response.data;
}

export async function deleteDietPlan(id: number) {
  const response = await api.delete(`/diet-plans/${id}`);
  return response.data;
}