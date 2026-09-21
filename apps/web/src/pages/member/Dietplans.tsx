import { useEffect, useState } from "react";
import { getDietPlans, type DietPlan } from "../../services/dietplan.services";

export default function DietPlans() {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDietPlans() {
      try {
        const data = await getDietPlans();
        setDietPlans(data);
      } catch (error) {
        console.error("Failed to load diet plans:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDietPlans();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
          Diet Plans
        </h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Explore nutrition plans prepared by our trainers to support your
          fitness goals.
        </p>
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 bg-primary" />

          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Nutrition
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-2xl border border-gray-800 bg-gray-950"
            />
          ))}
        </div>
      ) : dietPlans.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-gray-800 bg-gray-950 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gray-700 bg-gray-900">
            <span className="text-xl text-gray-500">—</span>
          </div>

          <h2 className="mt-5 font-serif text-2xl text-white">
            No Diet Plans Available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Nutrition plans created by your trainers will appear here.
          </p>
        </div>
      ) : (
        /* Diet Plan Cards */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {dietPlans.map((plan, index) => (
            <div
              key={plan.id}
              className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-gray-900"
            >
              {/* Card Header */}
              <div className="border-b border-gray-800 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-medium text-primary transition group-hover:bg-primary group-hover:text-black">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {plan.calories !== null && (
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-gray-600">
                        Calories
                      </p>

                      <p className="mt-1 font-serif text-xl text-primary">
                        {plan.calories}
                        <span className="ml-1 text-xs text-gray-500">kcal</span>
                      </p>
                    </div>
                  )}
                </div>

                <h2 className="mt-6 font-serif text-2xl text-white transition group-hover:text-primary">
                  {plan.name}
                </h2>

                {plan.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                    {plan.description}
                  </p>
                ) : (
                  <p className="mt-3 text-sm italic text-gray-600">
                    No description available.
                  </p>
                )}
              </div>

              {/* Nutrition */}
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-600">
                  Nutrition
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                    <p className="text-xs text-gray-500">Protein</p>

                    <p className="mt-2 text-lg font-medium text-white">
                      {plan.protein !== null ? `${plan.protein}g` : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                    <p className="text-xs text-gray-500">Carbs</p>

                    <p className="mt-2 text-lg font-medium text-white">
                      {plan.carbs !== null ? `${plan.carbs}g` : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                    <p className="text-xs text-gray-500">Fats</p>

                    <p className="mt-2 text-lg font-medium text-white">
                      {plan.fats !== null ? `${plan.fats}g` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trainer */}
              {plan.trainer?.user && (
                <div className="border-t border-gray-800 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-gray-600">
                      Prepared by
                    </span>

                    <span className="text-sm text-gray-300">
                      {plan.trainer.user.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
