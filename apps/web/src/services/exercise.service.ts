import api from "./api";

export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  muscleGroup: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExerciseData {
  name: string;
  description?: string;
  muscleGroup?: string;
}

export interface UpdateExerciseData {
  name?: string;
  description?: string;
  muscleGroup?: string;
}

export async function getExercises(): Promise<Exercise[]> {
  const response = await api.get("/exercises");
  return response.data.data;
}

export async function createExercise(data: CreateExerciseData) {
  const response = await api.post("/exercises", data);
  return response.data;
}

export async function updateExercise(
  id: number,
  data: UpdateExerciseData,
) {
  const response = await api.put(`/exercises/${id}`, data);
  return response.data;
}

export async function deleteExercise(id: number) {
  const response = await api.delete(`/exercises/${id}`);
  return response.data;
}