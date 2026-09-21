import bcrypt from "bcrypt";

import { db } from "../prisma/db.js";
import cloudinary from "../config/cloudinary.js";

interface CreateTrainerData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialty?: string;
  profileImage?: Express.Multer.File;
}


interface UpdateTrainerData {
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  profileImage?: Express.Multer.File;
}

function uploadToCloudinary(
  file: Express.Multer.File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "vyayamshala/trainers",
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

export async function createTrainer(
  data: CreateTrainerData,
) {
  const existingUser = await db.orm.public.User
    .where((user) => user.email.eq(data.email))
    .first();

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10,
  );

  let profileImageUrl: string | undefined;

  if (data.profileImage) {
    profileImageUrl = await uploadToCloudinary(
      data.profileImage,
    );
  }

  const user = await db.orm.public.User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "TRAINER",
  });

  const trainer = await db.orm.public.Trainer.create({
    userId: user.id,
    phone: data.phone,
    specialty: data.specialty,
    profileImage: profileImageUrl,
  });

  return {
    id: trainer.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: trainer.phone,
    specialty: trainer.specialty,
    profileImage: trainer.profileImage,
  };
}

export async function getTrainers() {
  return db.orm.public.Trainer
    .select(
      "id",
      "userId",
      "phone",
      "specialty",
      "profileImage",
      "createdAt",
      "updatedAt",
    )
    .include("user", (user) =>
      user.select(
        "id",
        "name",
        "email",
        "role",
      ),
    )
    .all();
}

export async function updateTrainer(
  id: number,
  data: UpdateTrainerData,
) {
  const trainer = await db.orm.public.Trainer
    .where((trainer) => trainer.id.eq(id))
    .first();

  if (!trainer) {
    throw new Error("Trainer not found");
  }

  let profileImageUrl: string | undefined;

  if (data.profileImage) {
    profileImageUrl = await uploadToCloudinary(
      data.profileImage,
    );
  }

  const updatedTrainer = await db.orm.public.Trainer
    .where((trainer) => trainer.id.eq(id))
    .update({
      phone: data.phone,
      specialty: data.specialty,
      ...(profileImageUrl && {
        profileImage: profileImageUrl,
      }),
    });

  const updatedUser = await db.orm.public.User
    .where((user) => user.id.eq(trainer.userId))
    .update({
      name: data.name,
      email: data.email,
    });

  if (!updatedTrainer || !updatedUser) {
    throw new Error("Failed to update trainer");
  }

  return {
    id: updatedTrainer.id,
    userId: updatedTrainer.userId,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedTrainer.phone,
    specialty: updatedTrainer.specialty,
    profileImage: updatedTrainer.profileImage,
  };
}

export async function deleteTrainer(id: number) {
  const trainer = await db.orm.public.Trainer
    .where((trainer) => trainer.id.eq(id))
    .first();

  if (!trainer) {
    throw new Error("Trainer not found");
  }

  await db.orm.public.Trainer
    .where((trainer) => trainer.id.eq(id))
    .delete();

  await db.orm.public.User
    .where((user) => user.id.eq(trainer.userId))
    .delete();

  return {
    message: "Trainer deleted successfully",
  };
}