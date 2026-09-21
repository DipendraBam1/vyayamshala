import api from "../api";

export interface Review {
  id: number;
  review: string;
  rating: number;
  image1?: string;
  image2?: string;
}

export async function createReview(
  review: string,
  rating: number,
  image1?: File,
  image2?: File,
) {
  const formData = new FormData();

  formData.append("review", review);
  formData.append("rating", String(rating));

  if (image1) {
    formData.append("image1", image1);
  }

  if (image2) {
    formData.append("image2", image2);
  }

  const response = await api.post("/reviews", formData);

  return response.data.data;
}

export async function getMyReviews(): Promise<Review[]> {
  const response = await api.get("/reviews/me");

  return response.data.data;
}