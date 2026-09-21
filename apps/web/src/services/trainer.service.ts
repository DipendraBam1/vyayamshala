import api from "./api";

export interface Trainer {
  id: number;
  phone: string | null;
  specialty: string | null;
  profileImage: string | null;

  user: {
    id: number;
    name: string;
    email: string;
    role: "TRAINER";
  };
}

export interface CreateTrainerData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialty?: string;
  profileImage?: File | null;
}

export interface UpdateTrainerData {
  name: string;
  email: string;
  phone?: string;
  specialty?: string;
  profileImage?: File | null;
}

export async function getTrainers(): Promise<Trainer[]> {
  const response = await api.get("/trainers");

  return response.data.data;
}

export async function createTrainer(
  data: CreateTrainerData,
) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (data.phone) {
    formData.append("phone", data.phone);
  }

  if (data.specialty) {
    formData.append("specialty", data.specialty);
  }

  if (data.profileImage) {
    formData.append(
      "profileImage",
      data.profileImage,
    );
  }

  const response = await api.post(
    "/trainers",
    formData,
  );

  return response.data;
}

export async function updateTrainer(
  id: number,
  data: UpdateTrainerData,
) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);

  if (data.phone) {
    formData.append("phone", data.phone);
  }

  if (data.specialty) {
    formData.append("specialty", data.specialty);
  }

  if (data.profileImage) {
    formData.append(
      "profileImage",
      data.profileImage,
    );
  }

  const response = await api.put(
    `/trainers/${id}`,
    formData,
  );

  return response.data;
}

export async function deleteTrainer(id: number) {
  const response = await api.delete(
    `/trainers/${id}`,
  );

  return response.data;
}