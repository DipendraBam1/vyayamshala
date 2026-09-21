import bcrypt from "bcrypt";
import { db } from "../prisma/db.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegisterData) {
  const { name, email, password } = data;

  // Check whether email already exists
  const existingUser = await db.orm.public.User.where((user) =>
    user.email.eq(email),
  ).first();

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await db.orm.public.User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginData) {
  const { email, password } = data;

  const user = await db.orm.public.User.where((user) =>
    user.email.eq(email),
  ).first();

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
