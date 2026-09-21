import api from "../api";

//member specific attendence

export async function getMyAttendance() {
  const response = await api.get("/attendance/my");
  return response.data.data;
}
export async function checkIn() {
  const response = await api.post("/attendance/check-in");
  return response.data.data;
}

export async function checkOut() {
  const response = await api.post("/attendance/check-out");
  return response.data.data;
}