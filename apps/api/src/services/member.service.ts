import bcrypt from "bcrypt";
import { db } from "../prisma/db.js";

interface CreateMemberData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export async function createMember(data: CreateMemberData) {
  const existingUser = await db.orm.public.User
    .where((user) => user.email.eq(data.email))
    .first();

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await db.orm.public.User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "MEMBER",
  });

  const member = await db.orm.public.Member.create({
    userId: user.id,
    phone: data.phone,
    address: data.address,
  });

  return {
    id: member.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: member.phone,
    address: member.address,
  };
}
export async function getMembers() {
  return db.orm.public.Member
    .select(
      "id",
      "userId",
      "phone",
      "address",
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
interface UpdateMemberData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export async function updateMember(
  id: number,
  data: UpdateMemberData,
) {
  const member = await db.orm.public.Member
    .where((member) => member.id.eq(id))
    .first();

  if (!member) {
    throw new Error("Member not found");
  }

  // Update Member information
  const updatedMember = await db.orm.public.Member
    .where((member) => member.id.eq(id))
    .update({
      phone: data.phone,
      address: data.address,
    });

  // Update User information
  const updatedUser = await db.orm.public.User
    .where((user) => user.id.eq(member.userId))
    .update({
      name: data.name,
      email: data.email,
    });

  if (!updatedMember || !updatedUser) {
    throw new Error("Failed to update member");
  }

  return {
    id: updatedMember.id,
    userId: updatedMember.userId,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedMember.phone,
    address: updatedMember.address,
  };
}
export async function deleteMember(id: number) {
  const member = await db.orm.public.Member
    .where((member) => member.id.eq(id))
    .first();

  if (!member) {
    throw new Error("Member not found");
  }

  // Delete attendance records
  await db.orm.public.Attendance
    .where((attendance) => attendance.memberId.eq(id))
    .delete();

  // Delete membership records
  await db.orm.public.Membership
    .where((membership) => membership.memberId.eq(id))
    .delete();

  // Delete member
  await db.orm.public.Member
    .where((member) => member.id.eq(id))
    .delete();

  // Delete user account
  await db.orm.public.User
    .where((user) => user.id.eq(member.userId))
    .delete();

  return {
    message: "Member deleted successfully",
  };
}