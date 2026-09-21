import { useEffect, useState } from "react";

import {
  getAttendance,
  type Attendance as AttendanceType,
} from "../../services/attendences";
import SearchFilter from "../../components/common/SearchFilter";

export default function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function loadAttendance() {
    try {
      const data = await getAttendance();
      setAttendance(data);
    } catch (error) {
      console.error("Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAttendance = attendance.filter((record) => {
    const searchText = search.toLowerCase();

    const matchesName = record.member.user.name
      .toLowerCase()
      .includes(searchText);

    const matchesEmail = record.member.user.email
      .toLowerCase()
      .includes(searchText);

    const matchesDate = !date || record.date === date;

    return (matchesName || matchesEmail) && matchesDate;
  });

  useEffect(() => {
    loadAttendance();
  }, []);

  function formatTime(time: string | null) {
    if (!time) {
      return "-";
    }

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading attendance...</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Attendance</h1>

        <p className="mt-2 text-gray-500">
          View gym members' attendance records.
        </p>
      </div>

      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search member by name or email..."
        dateValue={date}
        onDateChange={setDate}
      />

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-xl bg-white text-black shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Member</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Check In</th>

              <th className="p-4 text-left">Check Out</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">
                  Loading data...
                </td>
              </tr>
            ) : (
              filteredAttendance.map((record) => (
                <tr key={record.id} className="border-t transition hover:bg-gray-200">
                  <td className="p-4">
                    <div className="font-medium">{record.member.user.name}</div>

                    <div className="text-sm text-gray-500">
                      {record.member.user.email}
                    </div>
                  </td>

                  <td className="p-4">{record.date}</td>

                  <td className="p-4">{formatTime(record.checkIn)}</td>

                  <td className="p-4">{formatTime(record.checkOut)}</td>
                </tr>
              ))
            )}

            {filteredAttendance.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  {search || date
                    ? "No attendance records found."
                    : "No attendance records available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
