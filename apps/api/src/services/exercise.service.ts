import { db } from "../prisma/db.js";

interface CreateExerciseData {
  trainerId: number;
  name: string;
  description?: string;
  muscleGroup?: string;
}
interface UpdateExerciseData {
  name?: string;
  description?: string;
  muscleGroup?: string;
}
export async function createExercise(data: CreateExerciseData) {
  const trainer = await db.orm.public.Trainer
    .where({ id: data.trainerId })
    .first();

  if (!trainer) {
    throw new Error("Trainer not found");
  }

  const existingExercise = await db.orm.public.Exercise
    .where((exercise) => exercise.name.eq(data.name))
    .first();

  if (existingExercise) {
    throw new Error("Exercise already exists");
  }

  return db.orm.public.Exercise.create({
    trainerId: data.trainerId,
    name: data.name,
    description: data.description,
    muscleGroup: data.muscleGroup,
  });
}

export async function getExercises() {
  return db.orm.public.Exercise
    .select(
      "id",
      "name",
      "description",
      "muscleGroup",
      "createdAt",
      "updatedAt",
    )
    .all();
}


export async function updateExercise(
  id: number,
  trainerId: number | null,
  data: UpdateExerciseData,
) {
  const exercise = await db.orm.public.Exercise
    .where({ id })
    .first();

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  // Trainer can only update their own exercise
  if (trainerId !== null && exercise.trainerId !== trainerId) {
    throw new Error("You can only update your own exercises");
  }

  const updatedExercise = await db.orm.public.Exercise
    .where({ id })
    .update({
      name: data.name,
      description: data.description,
      muscleGroup: data.muscleGroup,
    });

  if (!updatedExercise) {
    throw new Error("Exercise not found");
  }

  return updatedExercise;
}
export async function deleteExercise(
  id: number,
  trainerId: number | null,
) {
  const exercise = await db.orm.public.Exercise
    .where({ id })
    .first();

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  // Trainer can only delete their own exercise
  if (trainerId !== null && exercise.trainerId !== trainerId) {
    throw new Error("You can only delete your own exercises");
  }

  await db.orm.public.Exercise
    .where({ id })
    .delete();

  return {
    message: "Exercise deleted successfully",
  };
}