import { useEffect, useState } from "react";
import { getExercises, type Exercise } from "../../services/exercise.service";

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
          Exercises
        </h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Explore the exercises available at Vyayamshala and build your training
          routine.
        </p>
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 bg-primary" />

          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Training
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-2xl border border-gray-800 bg-gray-950"
            />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-gray-800 bg-gray-950 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gray-700 bg-gray-900">
            <span className="text-xl text-gray-500">—</span>
          </div>

          <h2 className="mt-5 font-serif text-2xl text-white">
            No Exercises Available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Exercises added by your trainers will appear here.
          </p>
        </div>
      ) : (
        /* Exercise Cards */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="group rounded-2xl border border-gray-800 bg-gray-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-gray-900"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-medium text-primary transition group-hover:bg-primary group-hover:text-black">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {exercise.muscleGroup && (
                  <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-medium text-gray-400">
                    {exercise.muscleGroup}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="mt-7">
                <h2 className="font-serif text-2xl text-white transition group-hover:text-primary">
                  {exercise.name}
                </h2>

                <div className="mt-4 h-px w-full bg-gray-800" />

                {exercise.description ? (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                    {exercise.description}
                  </p>
                ) : (
                  <p className="mt-4 text-sm italic text-gray-600">
                    No description available.
                  </p>
                )}
              </div>

              {/* Bottom */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-gray-600">
                  Exercise
                </span>

                <span className="text-sm text-gray-600 transition group-hover:text-primary">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
