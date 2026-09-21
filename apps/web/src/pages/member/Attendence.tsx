import { useEffect, useState } from "react";
import {
  checkIn,
  checkOut,
  getMyAttendance,
} from "../../services/member/memberAttendence.service";

interface Attendance {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string | null;
}

export default function Attendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        const data = await getMyAttendance();
        setAttendance(data);
      } catch (error) {
        console.error("Failed to load attendance:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, []);

  async function handleCheckIn() {
    try {
      setActionLoading(true);
      setMessage("");

      await checkIn();

      setMessage("Checked in successfully.");

      const data = await getMyAttendance();
      setAttendance(data);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to check in.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut() {
    try {
      setActionLoading(true);
      setMessage("");

      await checkOut();

      setMessage("Checked out successfully.");

      const data = await getMyAttendance();
      setAttendance(data);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to check out.");
    } finally {
      setActionLoading(false);
    }
  }

  const totalDays = attendance.length;

  const checkedOutDays = attendance.filter((record) => record.checkOut).length;

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendance.find((record) => record.date === today);

  const currentlyCheckedIn = !!todayAttendance && !todayAttendance.checkOut;

  const todayCompleted = !!todayAttendance && !!todayAttendance.checkOut;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-white">My Attendance</h1>

        <p className="mt-2 text-gray-400">
          Track your gym visits and daily attendance.
        </p>
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 bg-primary" />

          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Attendance
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 hover:border-primary">
          <p className="text-sm text-gray-500">Total Visits</p>

          <p className="mt-3 font-serif text-4xl text-primary">
            {loading ? "-" : totalDays}
          </p>

          <p className="mt-2 text-sm text-gray-500">Days attended</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6  hover:border-primary">
          <p className="text-sm text-gray-500">Completed Visits</p>

          <p className="mt-3 font-serif text-4xl text-primary">
            {loading ? "-" : checkedOutDays}
          </p>

          <p className="mt-2 text-sm text-gray-500">Checked out successfully</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6  hover:border-primary">
          <p className="text-sm text-gray-500">Today's Status</p>

          <p className="mt-3 font-serif text-2xl text-white">
            {loading
              ? "Loading..."
              : todayCompleted
                ? "Completed"
                : currentlyCheckedIn
                  ? "Checked In"
                  : "Not Checked In"}
          </p>

          <p className="mt-2 text-sm text-gray-500">Today's attendance</p>
        </div>
      </div>

      {/* Check In / Check Out */}
      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl text-white">
              Today's Attendance
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {todayCompleted
                ? "Your attendance for today is completed."
                : currentlyCheckedIn
                  ? "You are checked in. Check out when you finish your workout."
                  : "Check in when you arrive and check out when you finish your workout."}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={actionLoading || !!todayAttendance}
              className="rounded-lg bg-primary px-5 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {actionLoading ? "Processing..." : "Check In"}
            </button>

            <button
              type="button"
              onClick={handleCheckOut}
              disabled={actionLoading || !currentlyCheckedIn}
              className="rounded-lg border border-gray-700 px-5 py-3 font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {actionLoading ? "Processing..." : "Check Out"}
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-5 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
            <p className="text-sm text-gray-300">{message}</p>
          </div>
        )}
      </div>

      {/* Attendance History */}
      <div>
        <div className="mb-4">
          <h2 className="font-serif text-2xl text-white">Attendance History</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your previous gym attendance records.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-8 text-center">
            <p className="text-gray-400">Loading attendance...</p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-10 text-center">
            <h3 className="font-serif text-xl text-white">No attendance yet</h3>

            <p className="mt-2 text-sm text-gray-500">
              Your attendance records will appear here after your first
              check-in.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50 text-left">
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Check In
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Check Out
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-800 transition hover:bg-gray-900/50 last:border-0"
                    >
                      <td className="px-6 py-5 text-sm text-white">
                        {record.date}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-300">
                        {new Date(record.checkIn).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-300">
                        {record.checkOut
                          ? new Date(record.checkOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      <td className="px-6 py-5">
                        {record.checkOut ? (
                          <span className="inline-flex rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-medium text-gray-300">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-medium text-black">
                            Checked In
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
