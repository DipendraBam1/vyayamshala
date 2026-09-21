import api from "../api";

export interface PublicReview {
  id: number;
  review: string;
  rating: number;
  image1?: string;
  image2?: string;
  member: {
    user: {
      name: string;
    };
  };
}

export async function getReviews(): Promise<PublicReview[]> {
  const response = await api.get("/reviews");

  return response.data.data;
}