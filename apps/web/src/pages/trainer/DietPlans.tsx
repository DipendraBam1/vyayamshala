import { useEffect, useState } from "react";

import SearchFilter from "../../components/common/SearchFilter";
import {
  createDietPlan,
  deleteDietPlan,
  getDietPlans,
  updateDietPlan,
  type DietPlan,
} from "../../services/dietplan.services";

export default function DietPlans() {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  async function loadDietPlans() {
    try {
      setLoading(true);
      const data = await getDietPlans();
      setDietPlans(data);
    } catch (error) {
      console.error("Failed to load diet plans:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDietPlans();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setEditingPlan(null);
    setShowForm(false);
  }

  function handleEdit(plan: DietPlan) {
    setEditingPlan(plan);

    setName(plan.name);
    setDescription(plan.description || "");
    setCalories(plan.calories?.toString() || "");
    setProtein(plan.protein || "");
    setCarbs(plan.carbs || "");
    setFats(plan.fats || "");

    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: name.trim(),
        description: description.trim() || undefined,
        calories: calories ? Number(calories) : undefined,
        protein: protein || undefined,
        carbs: carbs || undefined,
        fats: fats || undefined,
      };

      if (editingPlan) {
        await updateDietPlan(editingPlan.id, data);
      } else {
        await createDietPlan(data);
      }

      resetForm();
      await loadDietPlans();
    } catch (error) {
      console.error("Failed to save diet plan:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this diet plan?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingPlanId(id);
      await deleteDietPlan(id);
      await loadDietPlans();
    } catch (error) {
      console.error("Failed to delete diet plan:", error);
    } finally {
      setDeletingPlanId(null);
    }
  }

  const filteredPlans = dietPlans.filter((plan) => {
    const searchText = search.toLowerCase();

    return (
      plan.name.toLowerCase().includes(searchText) ||
      plan.description?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diet Plans</h1>
          <p className="mt-1 text-gray-400">
            Create and manage diet plans for members.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPlan(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-primary px-5 py-3 font-medium text-black transition hover:opacity-90"
        >
          + Add Diet Plan
        </button>
      </div>

      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search diet plans..."
      />

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {editingPlan ? "Edit Diet Plan" : "Add Diet Plan"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Plan Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Muscle Gain Diet"
                className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the diet plan..."
                rows={3}
                className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Calories
                </label>

                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="2500"
                  className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Protein (g)
                </label>

                <input
                  type="text"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="150"
                  className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Carbs (g)
                </label>

                <input
                  type="text"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="300"
                  className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Fats (g)
                </label>

                <input
                  type="text"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  placeholder="70"
                  className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-black disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingPlan
                    ? "Update Diet Plan"
                    : "Create Diet Plan"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-700 px-5 py-3 text-gray-300 hover:bg-gray-900"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading diet plans...</p>
      ) : filteredPlans.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-10 text-center">
          <p className="text-gray-400">No diet plans found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-950">
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Calories</th>
                <th className="px-6 py-4">Protein</th>
                <th className="px-6 py-4">Carbs</th>
                <th className="px-6 py-4">Fats</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b border-gray-800 last:border-0 transition hover:bg-gray-900"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{plan.name}</p>

                      {plan.description && (
                        <p className="mt-1 max-w-xs text-sm text-gray-500">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {plan.calories ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {plan.protein ? `${plan.protein} g` : "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {plan.carbs ? `${plan.carbs} g` : "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {plan.fats ? `${plan.fats} g` : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(plan)}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(plan.id)}
                        disabled={deletingPlanId === plan.id}
                        className="text-red-500 hover:underline disabled:opacity-50"
                      >
                        {deletingPlanId === plan.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}