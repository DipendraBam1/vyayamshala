import { db } from "../prisma/db.js";
import cloudinary from "../config/cloudinary.js";

interface CreateReviewData {
  userId: number;
  review: string;
  rating: number;
  image1?: Express.Multer.File;
  image2?: Express.Multer.File;
}

function uploadToCloudinary(
  file: Express.Multer.File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "vyayamshala/reviews",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result.secure_url);
      },
    );

    uploadStream.end(file.buffer);
  });
}

export async function createReview(data: CreateReviewData) {
  const member = await db.orm.public.Member
    .where({ userId: data.userId })
    .first();

  if (!member) {
    throw new Error("Member not found");
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  if (!data.review.trim()) {
    throw new Error("Review is required");
  }

  let image1Url: string | undefined;
  let image2Url: string | undefined;

  if (data.image1) {
    image1Url = await uploadToCloudinary(data.image1);
  }

  if (data.image2) {
    image2Url = await uploadToCloudinary(data.image2);
  }

  return db.orm.public.Review.create({
    memberId: member.id,
    review: data.review.trim(),
    rating: data.rating,
    image1: image1Url,
    image2: image2Url,
  });
}

export async function getReviews() {
  return db.orm.public.Review
    .include("member", (member) =>
      member.include("user", (user) =>
        user.select("name"),
      ),
    )
    .all();
}

export async function getMyReviews(userId: number) {
  const member = await db.orm.public.Member
    .where({ userId })
    .first();

  if (!member) {
    throw new Error("Member not found");
  }

  return db.orm.public.Review
    .where({ memberId: member.id })
    .all();
}