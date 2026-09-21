import api from "./api";

export interface DashboardStats {
totalMembers: number;
totalTrainers: number;
activeMemberships: number;
todayAttendance: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
const response = await api.get("/dashboard/stats");

return response.data.data;
}
