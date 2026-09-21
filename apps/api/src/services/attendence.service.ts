import { db } from "../prisma/db.js";
function getNepalDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
  }).format(new Date());
}
export async function checkIn(memberId: number) {
  const member = await db.orm.public.Member.where({ id: memberId }).first();

  if (!member) {
    throw new Error("Member not found");
  }

  const today = getNepalDate();

  const attendances = await db.orm.public.Attendance.where({ memberId }).all();

  const existingAttendance = attendances.find(
    (attendance) => attendance.date === today,
  );

  if (existingAttendance) {
    throw new Error("Member has already checked in today");
  }

  const checkInTime = new Date().toISOString();

  return db.orm.public.Attendance.create({
    memberId,
    date: today,
    checkIn: checkInTime,
  });
}

export async function checkOut(memberId: number) {
  const today = getNepalDate();
  const attendances = await db.orm.public.Attendance.where({ memberId }).all();

  const attendance = attendances.find((record) => record.date === today);

  if (!attendance) {
    throw new Error("No check-in record found for today");
  }

  if (attendance.checkOut) {
    throw new Error("Member has already checked out today");
  }

  return db.orm.public.Attendance.where({ id: attendance.id }).update({
    checkOut: new Date().toISOString(),
  });
}

export async function getAttendance() {
  return db.orm.public.Attendance.include("member", (member) =>
    member.include("user", (user) => user.select("id", "name", "email")),
  ).all();
}

export async function getMemberAttendance(memberId: number) {
  return db.orm.public.Attendance.where({ memberId })
    .include("member", (member) =>
      member.include("user", (user) => user.select("id", "name", "email")),
    )
    .all();
}
