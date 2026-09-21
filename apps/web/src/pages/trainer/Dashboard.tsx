import { useEffect, useState } from "react";
import { getMembers } from "../../services/member.services";
import { getAttendance } from "../../services/attendences";
import { getExercises } from "../../services/exercise.service";
import { getDietPlans } from "../../services/dietplan.services";
  

export default function TrainerDashboard() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [totalDietPlans, setTotalDietPlans] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);

  const [loading, setLoading] = useState(true);

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
  }).format(new Date());

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          members,
          attendance,
          exercises,
          dietPlans,
        ] = await Promise.all([
          getMembers(),
          getAttendance(),
          getExercises(),
          getDietPlans(),
        ]);

        setTotalMembers(members.length);
        setTotalExercises(exercises.length);
        setTotalDietPlans(dietPlans.length);

        const todayRecords = attendance.filter(
          (record:any) => record.date === today,
        );

        setTodayAttendance(todayRecords.length);
      } catch (error) {
        console.error("Failed to load trainer dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [today]);

  const stats = [
    {
      title: "Total Members",
      value: totalMembers,
    },
    {
      title: "Exercises",
      value: totalExercises,
    },
    {
      title: "Diet Plans",
      value: totalDietPlans,
    },
    {
      title: "Today's Attendance",
      value: todayAttendance,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-white">
          Trainer Dashboard
        </h1>

        <p className="mt-2 text-gray-400">
          Manage exercises and diet plans for Vyayamshala members.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-800 bg-gray-950 p-6"
          >
            <p className="text-sm text-gray-400">
              {stat.title}
            </p>

            {loading ? (
              <div className="mt-3 h-10 w-16 animate-pulse rounded bg-gray-800" />
            ) : (
              <h2 className="mt-3 font-serif text-4xl text-primary">
                {stat.value}
              </h2>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 font-serif text-2xl text-white">
          Quick Actions
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <a
            href="/trainer/exercises"
            className="rounded-xl border border-gray-800 bg-gray-950 p-6 transition hover:border-primary"
          >
            <h3 className="font-serif text-xl text-white">
              Manage Exercises
            </h3>

            <p className="mt-2 text-gray-400">
              Add, edit or remove exercises.
            </p>
          </a>

          <a
            href="/trainer/diet-plans"
            className="rounded-xl border border-gray-800 bg-gray-950 p-6 transition hover:border-primary"
          >
            <h3 className="font-serif text-xl text-white">
              Manage Diet Plans
            </h3>

            <p className="mt-2 text-gray-400">
              Create and manage diet plans.
            </p>
          </a>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
        <h2 className="font-serif text-2xl text-white">
          Today's Attendance
        </h2>

        <p className="mt-2 text-gray-400">
          {loading
            ? "Loading attendance..."
            : `${todayAttendance} member${
                todayAttendance === 1 ? "" : "s"
              } checked in today.`}
        </p>
      </div>
    </div>
  );
}