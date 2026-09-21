import { useEffect, useState } from "react";
import {
  createMembershipPlan,
  deleteMembershipPlan,
  getMembershipPlans,
  updateMembershipPlan,
  type MembershipPlan,
} from "../../services/membership-plans";
import SearchFilter from "../../components/common/SearchFilter";

export default function MembershipPlans() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  async function loadPlans() {
    try {
      const data = await getMembershipPlans();
      setPlans(data);
    } catch {
      alert("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  }

  const filteredPlans = plans.filter((plan) => {
    const searchText = search.toLowerCase();

    return (
      plan.name.toLowerCase().includes(searchText) ||
      (plan.description || "").toLowerCase().includes(searchText)
    );
  });

  useEffect(() => {
    loadPlans();
  }, []);

  function handleAdd() {
    setEditingPlan(null);
    setShowForm(true);
  }

  function handleEdit(plan: MembershipPlan) {
    setEditingPlan(plan);
    setShowForm(true);
  }
  async function handleDelete(plan: MembershipPlan) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${plan.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingPlanId(plan.id);

      await deleteMembershipPlan(plan.id);
      await loadPlans();
    } catch (error: any) {
      console.error("Failed to delete membership plan:", error);

      alert(
        error.response?.data?.message || "Failed to delete membership plan",
      );
    } finally {
      setDeletingPlanId(null);
    }
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const duration = Number(formData.get("duration"));
    const durationUnit = formData.get("durationUnit") as
      | "WEEK"
      | "MONTH"
      | "YEAR";
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;

    try {
      if (editingPlan) {
        await updateMembershipPlan(editingPlan.id, {
          name,
          duration,
          durationUnit,
          price,
          description,
        });
      } else {
        await createMembershipPlan({
          name,
          duration,
          durationUnit,
          price,
          description,
        });
      }

      setShowForm(false);
      setEditingPlan(null);

      await loadPlans();
    } catch {
      alert(
        editingPlan
          ? "Failed to update membership plan"
          : "Failed to create membership plan",
      );
    }
  }

  if (loading) {
    return <p className="text-gray-400">Loading membership plans...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-white">Membership Plans</h1>

          <p className="mt-2 text-gray-400">
            Create and manage gym membership plans.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-full bg-primary px-6 py-3 font-medium text-black transition hover:opacity-90"
        >
          + Add Plan
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-6 font-serif text-2xl text-white">
            {editingPlan ? "Edit Membership Plan" : "Add Membership Plan"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Plan Name
              </label>

              <input
                name="name"
                defaultValue={editingPlan?.name || ""}
                placeholder="e.g. Monthly"
                required
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Duration
              </label>

              <div className="flex gap-3">
                <input
                  name="duration"
                  type="number"
                  min="1"
                  defaultValue={editingPlan?.duration || ""}
                  placeholder="1"
                  required
                  className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
                />

                <select
                  name="durationUnit"
                  defaultValue={editingPlan?.durationUnit || "MONTH"}
                  className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
                >
                  <option value="WEEK">Week</option>
                  <option value="MONTH">Month</option>
                  <option value="YEAR">Year</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Price (NPR)
              </label>

              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={editingPlan?.price || ""}
                placeholder="3000"
                required
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Description
              </label>

              <input
                name="description"
                defaultValue={editingPlan?.description || ""}
                placeholder="Monthly gym access"
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 font-medium text-black"
              >
                {editingPlan ? "Update Plan" : "Create Plan"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPlan(null);
                }}
                className="rounded-full border border-gray-700 px-6 py-3 text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search membership plan..."
      />

      {/* Plans */}
      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr className="text-left text-sm text-gray-400">
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPlans.map((plan) => (
              <tr
                key={plan.id}
                className="border-t border-gray-800 hover:bg-gray-900"
              >
                <td className="px-6 py-4 text-white">{plan.name}</td>

                <td className="px-6 py-4 text-gray-400">
                  {plan.duration} {plan.durationUnit.toLowerCase()}
                  {plan.duration > 1 ? "s" : ""}
                </td>

                <td className="px-6 py-4 text-primary">NPR {plan.price}</td>

                <td className="px-6 py-4 text-gray-400">
                  {plan.description || "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan)}
                      disabled={deletingPlanId !== null}
                      className="text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingPlanId === plan.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {filteredPlans.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                {search
                  ? "No membership plans found."
                  : "No membership plans available."}
              </td>
            </tr>
          )}
        </table>
      </div>
    </div>
  );
}
