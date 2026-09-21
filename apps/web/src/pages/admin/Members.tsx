import { useEffect, useState } from "react";
import {
  createMember,
  deleteMember,
  getMembers,
  updateMember,
  type Member,
} from "../../services/member.services";
import SearchFilter from "../../components/common/SearchFilter";

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [submitting, setSubmitting] = useState(false);
  async function loadMembers() {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch {
      alert("Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  const filteredMembers = members.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      member.user.name.toLowerCase().includes(searchText) ||
      member.user.email.toLowerCase().includes(searchText)
    );
  });

  useEffect(() => {
    loadMembers();
  }, []);

  function handleAdd() {
    setEditingMember(null);
    setShowForm(true);
  }

  function handleEdit(member: Member) {
    setEditingMember(member);
    setShowForm(true);
  }
  async function handleDelete(member: Member) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(member.id);
      await deleteMember(member.id);

      await loadMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
      alert("Failed to delete member");
    } finally {
      setDeleting(null);
    }
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    try {
      setSubmitting(true);
      if (editingMember) {
        await updateMember(editingMember.id, {
          name,
          email,
          phone,
          address,
        });
      } else {
        const password = formData.get("password") as string;

        await createMember({
          name,
          email,
          password,
          phone,
          address,
        });
      }

      setShowForm(false);
      setEditingMember(null);

      await loadMembers();
    } catch {
      alert(
        editingMember ? "Failed to update member" : "Failed to create member",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-gray-400">Loading members...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-white">Members</h1>

          <p className="mt-2 text-gray-400">Manage Vyayamshala members.</p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-full bg-primary px-6 py-3 font-medium text-black transition hover:opacity-90"
        >
          + Add Member
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-6 font-serif text-2xl text-white">
            {editingMember ? "Edit Member" : "Add Member"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-400">Name</label>

              <input
                name="name"
                defaultValue={editingMember?.user.name || ""}
                required
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Email</label>

              <input
                name="email"
                type="email"
                defaultValue={editingMember?.user.email || ""}
                required
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            {!editingMember && (
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Password
                </label>

                <input
                  name="password"
                  type="password"
                  required
                  className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-gray-400">Phone</label>

              <input
                name="phone"
                defaultValue={editingMember?.phone || ""}
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-400">
                Address
              </label>

              <input
                name="address"
                defaultValue={editingMember?.address || ""}
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-6 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? editingMember
                    ? "Updating..."
                    : "Adding..."
                  : editingMember
                    ? "Update Member"
                    : "Create Member"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMember(null);
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
        searchPlaceholder="Search member by name or email..."
      />

      {/* Members table */}
      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr className="text-left text-sm text-gray-400">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member) => (
              <tr
                key={member.id}
                className="border-t border-gray-800 transition hover:bg-gray-900"
              >
                <td className="px-6 py-4 text-white">{member.user.name}</td>

                <td className="px-6 py-4 text-gray-400">{member.user.email}</td>

                <td className="px-6 py-4 text-gray-400">
                  {member.phone || "-"}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {member.address || "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(member)}
                      disabled={deleting !== null}
                      className="text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleting == member.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  {search ? "No members found." : "No members available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
