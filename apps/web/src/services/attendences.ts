
import api from "./api";

export interface Attendance {
  id: number;
  memberId: number;
  date: string;
  checkIn: string;
  checkOut: string | null;

  member: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export async function getAttendance(): Promise<Attendance[]> {
  const response = await api.get("/attendance");

  return response.data.data;
}

export async function getMemberAttendance(
  memberId: number,
): Promise<Attendance[]> {
  const response = await api.get(
    `/attendance/member/${memberId}`,
  );

  return response.data.data;
}

export async function checkIn(memberId: number) {
  const response = await api.post(
    "/attendance/check-in",
    { memberId },
  );

  return response.data;
}

export async function checkOut(memberId: number) {
  const response = await api.post(
    "/attendance/check-out",
    { memberId },
  );

  return response.data;
}
