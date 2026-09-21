import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMembers } from "../../services/member.services";
import { getTrainers } from "../../services/trainer.service";
import { getMemberships } from "../../services/memvership";
import { getAttendance } from "../../services/attendences";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [members, setMembers] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);

  const [totalMembers, setTotalMembers] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [activeMemberships, setActiveMemberships] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [membersData, trainersData, membershipsData, attendanceData] =
          await Promise.all([
            getMembers(),
            getTrainers(),
            getMemberships(),
            getAttendance(),
          ]);

        setMembers(membersData);
        setMemberships(membershipsData);
        setAttendance(attendanceData);

        setTotalMembers(membersData.length);
        setTotalTrainers(trainersData.length);

        setActiveMemberships(
          membershipsData.filter((membership) => membership.status === "ACTIVE")
            .length,
        );

        const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kathmandu",
        }).format(new Date());

        setTodayAttendance(
          attendanceData.filter((record) => record.date === today).length,
        );
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
  }).format(new Date());

  const todayAttendanceRecords = attendance.filter(
    (record) => record.date === today,
  );

  const activeMembershipCount = memberships.filter(
    (membership) => membership.status === "ACTIVE",
  ).length;

  const expiredMembershipCount = memberships.filter(
    (membership) => membership.status === "EXPIRED",
  ).length;

  const cancelledMembershipCount = memberships.filter(
    (membership) => membership.status === "CANCELLED",
  ).length;

  return (
    <div>
      {" "}
      <div className="mb-8">
        {" "}
        <h1 className="font-serif text-4xl text-white">Admin Dashboard </h1>
        <p className="mt-2 text-gray-400">
          Welcome back. Here's what's happening at Vyayamshala.
        </p>
      </div>
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="border border-gray-800 rounded-xl transition hover:border-primary">
          <DashboardCard
            title="Total Members"
            value={String(totalMembers)}
            loading={loading}
          />
        </div>

        <div className="border border-gray-800 rounded-xl transition hover:border-primary">
          <DashboardCard
            title="Total Trainers"
            value={String(totalTrainers)}
            loading={loading}
          />
        </div>
        <div className="border border-gray-800 rounded-xl transition hover:border-primary">
          <DashboardCard
            title="Active Memberships"
            value={String(activeMemberships)}
            loading={loading}
          />
        </div>

        <div className="border border-gray-800 rounded-xl transition hover:border-primary">
          <DashboardCard
            title="Today's Attendance"
            value={String(todayAttendance)}
            loading={loading}
          />
        </div>
      </div>
      {/* Attendance + Membership Overview */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Today's Attendance */}
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 lg:col-span-2">
          <div className="mb-5">
            <h2 className="font-serif text-2xl text-white">
              Today's Attendance
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Members who visited the gym today.
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-gray-400">Loading...</p>
          ) : todayAttendanceRecords.length === 0 ? (
            <p className="py-8 text-center text-gray-400">
              No attendance today.
            </p>
          ) : (
            <div className="space-y-3">
              {todayAttendanceRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b border-gray-800 pb-3"
                >
                  <div>
                    <p className="text-white">{record.member.user.name}</p>

                    <p className="text-sm text-gray-500">
                      {record.member.user.email}
                    </p>
                  </div>

                  <div className="text-right text-sm">
                    <p className="text-gray-300">
                      {new Date(record.checkIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="text-gray-500">
                      {record.checkOut
                        ? new Date(record.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Still in gym"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Membership Overview */}
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="font-serif text-2xl text-white">
            Membership Overview
          </h2>

          <div className="mt-6 space-y-5">
            <div className="flex justify-between">
              <span className="text-green-400">Active</span>
              <span className="text-white">
                {loading ? "..." : activeMembershipCount}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-red-500">Expired</span>
              <span className="text-white">
                {loading ? "..." : expiredMembershipCount}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-orange-400">Cancelled</span>
              <span className="text-white">
                {loading ? "..." : cancelledMembershipCount}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Members */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
        <div className="mb-5">
          <h2 className="font-serif text-2xl text-white">Recent Members</h2>

          <p className="mt-1 text-sm text-gray-400">
            Recently registered gym members.
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-gray-400">Loading...</p>
        ) : members.length === 0 ? (
          <p className="py-8 text-center text-gray-400">
            No members available.
          </p>
        ) : (
          <div className="space-y-3">
            {members
              .slice(-5)
              .reverse()
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-1 border-b border-gray-800 pb-3 transition hover:bg-gray-900"
                >
                  <div>
                    <p className="text-white">{member.user.name}</p>

                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>

                  <span className="text-sm text-gray-500">Member</span>
                </div>
              ))}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="font-serif text-2xl text-white">Quick Actions</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => navigate("/admin/members")}
            className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-primary"
          >
            <p className="text-white">Add Member</p>

            <p className="mt-1 text-sm text-gray-500">
              Register a new gym member
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/trainers")}
            className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-primary"
          >
            <p className="text-white">Add Trainer</p>

            <p className="mt-1 text-sm text-gray-500">Register a new trainer</p>
          </button>

          <button
            onClick={() => navigate("/admin/membership-plans")}
            className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-primary"
          >
            <p className="text-white">Create Plan</p>

            <p className="mt-1 text-sm text-gray-500">
              Create a membership plan
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/memberships")}
            className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-primary"
          >
            <p className="text-white">Assign Membership</p>

            <p className="mt-1 text-sm text-gray-500">
              Assign a plan to a member
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  loading: boolean;
}

function DashboardCard({ title, value, loading }: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
      {" "}
      <p className="text-sm text-gray-400">{title}</p>
      {loading ? (
        <div className="mt-3 h-10 w-16 animate-pulse rounded bg-gray-800" />
      ) : (
        <h2 className="mt-3 font-serif text-4xl text-primary">{value}</h2>
      )}
    </div>
  );
}
