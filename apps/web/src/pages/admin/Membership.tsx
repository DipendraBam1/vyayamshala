import { useEffect, useState } from "react";

import {
  getMemberships,
  createMembership,
  updateMembership,
  type Membership,
  cancelMembership,
} from "../../services/memvership";

import { getMembers, type Member } from "../../services/member.services";

import {
  getMembershipPlans,
  type MembershipPlan,
} from "../../services/membership-plans";
import SearchFilter from "../../components/common/SearchFilter";

export default function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingMembershipId, setCancellingMembershipId] = useState<
    number | null
  >(null);
  const [form, setForm] = useState({
    memberId: "",
    planId: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });

  async function loadData() {
    try {
      const [membershipData, memberData, planData] = await Promise.all([
        getMemberships(),
        getMembers(),
        getMembershipPlans(),
      ]);

      setMemberships(membershipData);
      setMembers(memberData);
      setPlans(planData);
    } catch (error) {
      console.error("Failed to load membership data:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredMemberships = memberships.filter((membership) => {
    const searchText = search.toLowerCase();

    return (
      membership.member.user.name.toLowerCase().includes(searchText) ||
      membership.member.user.email.toLowerCase().includes(searchText) ||
      membership.plan.name.toLowerCase().includes(searchText)
    );
  });

  useEffect(() => {
    loadData();
  }, []);

  /*
   * Calculate membership end date
   * based on selected plan duration.
   */
  function calculateEndDate(startDate: string, plan: MembershipPlan) {
    if (!startDate) {
      return "";
    }

    const date = new Date(`${startDate}T00:00:00`);

    switch (plan.durationUnit) {
      case "DAY":
        date.setDate(date.getDate() + plan.duration);
        break;

      case "WEEK":
        date.setDate(date.getDate() + plan.duration * 7);
        break;

      case "MONTH":
        date.setMonth(date.getMonth() + plan.duration);
        break;

      case "YEAR":
        date.setFullYear(date.getFullYear() + plan.duration);
        break;
    }

    return date.toISOString().split("T")[0];
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((previous) => {
      const updatedForm = {
        ...previous,
        [name]: value,
      };

      /*
       * When plan or start date changes,
       * calculate the end date automatically.
       */
      if (name === "planId" || name === "startDate") {
        const selectedPlanId = name === "planId" ? value : previous.planId;

        const selectedStartDate =
          name === "startDate" ? value : previous.startDate;

        const selectedPlan = plans.find(
          (plan) => plan.id === Number(selectedPlanId),
        );

        if (selectedPlan && selectedStartDate) {
          updatedForm.endDate = calculateEndDate(
            selectedStartDate,
            selectedPlan,
          );
        } else {
          updatedForm.endDate = "";
        }
      }

      return updatedForm;
    });
  }

  function resetForm() {
    setForm({
      memberId: "",
      planId: "",
      startDate: "",
      endDate: "",
      status: "ACTIVE",
    });

    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = {
        memberId: Number(form.memberId),
        planId: Number(form.planId),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      };

      if (editingId) {
        await updateMembership(editingId, data);
      } else {
        await createMembership(data);
      }

      resetForm();
      await loadData();
    } catch (error: any) {
      console.error("Failed to save membership:", error);

      const message =
        error.response?.data?.message || "Failed to save membership";

      alert(message);
    }
  }

  function handleEdit(membership: Membership) {
    setEditingId(membership.id);

    setForm({
      memberId: String(membership.memberId),
      planId: String(membership.planId),
      startDate: membership.startDate,
      endDate: membership.endDate,
      status: membership.status,
    });
  }
  async function handleCancel(membership: Membership) {
    const confirmed = window.confirm(
      `Are you sure you want to cancel ${membership.member.user.name}'s membership?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingMembershipId(membership.id);

      await cancelMembership(membership.id);
      await loadData();
    } catch (error: any) {
      console.error("Failed to cancel membership:", error);

      alert(error.response?.data?.message || "Failed to cancel membership");
    } finally {
      setCancellingMembershipId(null);
    }
  }
  return (
    <div className="p-8">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Memberships</h1>

        <p className="mt-2 text-gray-500">
          Assign membership plans to gym members.
        </p>
      </div>

      {/* Form */}

      <div className="mb-8 rounded-xl bg-white p-6 text-black shadow">
        <h2 className="mb-6 text-xl font-semibold">
          {editingId ? "Edit Membership" : "Assign Membership"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          {/* Member */}

          <div>
            <label className="mb-1 block text-sm font-medium">Member</label>

            <select
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            >
              <option value="">Select member</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Plan */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Membership Plan
            </label>

            <select
              name="planId"
              value={form.planId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            >
              <option value="">Select plan</option>

              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} — {plan.duration}{" "}
                  {plan.durationUnit.toLowerCase()}
                  {plan.duration > 1 ? "s" : ""} — NPR {plan.price}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}

          <div>
            <label className="mb-1 block text-sm font-medium">Start Date</label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* End Date */}

          <div>
            <label className="mb-1 block text-sm font-medium">End Date</label>

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border bg-gray-100 p-3 text-gray-600"
            />

            <p className="mt-1 text-xs text-gray-500">
              Automatically calculated from the membership plan.
            </p>
          </div>

          {/* Status */}

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              <option value="ACTIVE">ACTIVE</option>

              <option value="EXPIRED">EXPIRED</option>

              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Buttons */}

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="rounded-xl border border-gray-600 bg-primary px-6 py-3 font-medium"
            >
              {editingId ? "Update Membership" : "Assign Membership"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-6 py-3"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search member or membership plan..."
      />

      {/* Table */}

      <div className="overflow-hidden rounded-xl bg-white text-black shadow ">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Member</th>

              <th className="p-4 text-left">Plan</th>

              <th className="p-4 text-left">Start Date</th>

              <th className="p-4 text-left">End Date</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Loading data...
                </td>
              </tr>
            ) : (
              filteredMemberships.map((membership) => (
                <tr
                  key={membership.id}
                  className="border-t transition hover:bg-gray-200"
                >
                  <td className="p-4">{membership.member.user.name}</td>

                  <td className="p-4">{membership.plan.name}</td>

                  <td className="p-4">{membership.startDate}</td>

                  <td className="p-4">{membership.endDate}</td>

                  <td className="p-4">{membership.status}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(membership)}
                        className="rounded-full bg-gray-600 px-3 py-1 text-white hover:bg-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancel(membership)}
                        disabled={
                          membership.status !== "ACTIVE" ||
                          cancellingMembershipId !== null
                        }
                        className="rounded-full bg-red-500 px-2 py-1 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingMembershipId === membership.id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}

            {!loading && filteredMemberships.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  {search
                    ? "No memberships found."
                    : "No memberships available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
