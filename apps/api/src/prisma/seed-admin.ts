import bcrypt from "bcrypt";
import { db } from "./db.js";

const email = "admin@vyayamshala.com";
const password = "admin123";
const name = "Admin";

async function seedAdmin() {
  const existingAdmin = await db.orm.public.User
    .where((user) => user.email.eq(email))
    .first();

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.orm.public.User.create({
    name,
    email,
    password: hashedPassword,
    role: "ADMIN",
  });

  console.log("Admin created successfully");
}

seedAdmin().catch((error) => {
  console.error("Failed to create admin:", error);
});