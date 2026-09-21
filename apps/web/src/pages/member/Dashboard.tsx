import { useEffect, useState } from "react";

import { getMyAttendance } from "../../services/member/memberAttendence.service";
import { getExercises } from "../../services/exercise.service";
import { getDietPlans } from "../../services/dietplan.services";

export default function MemberDashboard() {
  const [totalExercises, setTotalExercises] = useState(0);
  const [totalDietPlans, setTotalDietPlans] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(false);

  const [loading, setLoading] = useState(true);

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
  }).format(new Date());

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [attendance, exercises, dietPlans] = await Promise.all([
          getMyAttendance(),
          getExercises(),
          getDietPlans(),
        ]);

        setTotalExercises(exercises.length);
        setTotalDietPlans(dietPlans.length);

        // Total attendance records for this member
        setTotalVisits(attendance.length);

        // Check whether the member has attendance for today
        const todayRecord = attendance.find(
          (record:any) => record.date === today,
        );

        setTodayAttendance(!!todayRecord);
      } catch (error) {
        console.error("Failed to load member dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [today]);

  const stats = [
    {
      title: "Available Exercises",
      value: totalExercises,
    },
    {
      title: "Available Diet Plans",
      value: totalDietPlans,
    },
    {
      title: "Total Gym Visits",
      value: totalVisits,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 bg-primary" />

          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Member Area
          </span>
        </div>

        <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
          Member Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          View your gym activity, exercises, nutrition plans and attendance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group rounded-2xl border border-gray-800 bg-gray-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-gray-900"
          >
            <p className="text-sm text-gray-400">
              {stat.title}
            </p>

            {loading ? (
              <div className="mt-4 h-10 w-16 animate-pulse rounded bg-gray-800" />
            ) : (
              <h2 className="mt-4 font-serif text-4xl text-primary transition group-hover:text-white">
                {stat.value}
              </h2>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <div className="mb-5">
          <h2 className="font-serif text-2xl text-white">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access your training and nutrition resources.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <a
            href="/member/exercises"
            className="group rounded-2xl border border-gray-800 bg-gray-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-white transition group-hover:text-primary">
                View Exercises
              </h3>

              <span className="text-lg text-gray-600 transition group-hover:text-primary">
                →
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Explore exercises available at Vyayamshala.
            </p>
          </a>

          <a
            href="/member/diet-plans"
            className="group rounded-2xl border border-gray-800 bg-gray-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-white transition group-hover:text-primary">
                View Diet Plans
              </h3>

              <span className="text-lg text-gray-600 transition group-hover:text-primary">
                →
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              View nutrition plans created by your trainers.
            </p>
          </a>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="group mt-10 rounded-2xl border border-gray-800 bg-gray-950 p-6 transition duration-300 hover:border-primary/60 hover:bg-gray-900">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl text-white">
                Today's Attendance
              </h2>

              {!loading && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    todayAttendance
                      ? "bg-primary text-black"
                      : "border border-gray-700 bg-gray-900 text-gray-400"
                  }`}
                >
                  {todayAttendance
                    ? "Present"
                    : "Not Checked In"}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {loading
                ? "Loading attendance..."
                : todayAttendance
                  ? "You have checked in today."
                  : "You have not checked in today."}
            </p>
          </div>

          <a
            href="/member/attendance"
            className="w-fit rounded-lg border border-gray-700 px-5 py-3 text-sm font-medium text-white transition hover:border-primary hover:text-primary"
          >
            View Attendance
          </a>
        </div>
      </div>
    </div>
  );
}