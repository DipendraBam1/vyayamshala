import { useEffect, useState } from "react";
import {
  createTrainer,
  deleteTrainer,
  getTrainers,
  updateTrainer,
  type Trainer,
} from "../../services/trainer.service";
import SearchFilter from "../../components/common/SearchFilter";

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingTrainerId, setDeletingTrainerId] = useState<number | null>(
    null,
  );
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  async function loadTrainers() {
    try {
      const data = await getTrainers();
      setTrainers(data);
    } catch {
      alert("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  }

  const filteredTrainers = trainers.filter((trainer) => {
    const searchText = search.toLowerCase();

    return (
      trainer.user.name.toLowerCase().includes(searchText) ||
      trainer.user.email.toLowerCase().includes(searchText) ||
      (trainer.specialty || "").toLowerCase().includes(searchText)
    );
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  function handleAdd() {
    setEditingTrainer(null);
    setProfileImage(null);
    setShowForm(true);
  }

  function handleEdit(trainer: Trainer) {
    setEditingTrainer(trainer);
    setProfileImage(null);
    setShowForm(true);
  }
  async function handleDelete(trainer: Trainer) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${trainer.user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTrainerId(trainer.id);

      await deleteTrainer(trainer.id);
      await loadTrainers();
    } catch (error: any) {
      console.error("Failed to delete trainer:", error);

      alert(error.response?.data?.message || "Failed to delete trainer");
    } finally {
      setDeletingTrainerId(null);
    }
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const specialty = formData.get("specialty") as string;

    try {
      setSubmitting(true);

      if (editingTrainer) {
        await updateTrainer(editingTrainer.id, {
          name,
          email,
          phone,
          specialty,
          profileImage,
        });
      } else {
        const password = formData.get("password") as string;

        await createTrainer({
          name,
          email,
          password,
          phone,
          specialty,
          profileImage,
        });
      }

      setShowForm(false);
      setEditingTrainer(null);
      setProfileImage(null);

      await loadTrainers();
    } catch {
      alert(
        editingTrainer
          ? "Failed to update trainer"
          : "Failed to create trainer",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-gray-400">Loading trainers...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-white">Trainers</h1>

          <p className="mt-2 text-gray-400">Manage Vyayamshala trainers.</p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-full bg-primary px-6 py-3 font-medium text-black transition hover:opacity-90"
        >
          + Add Trainer
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-6 font-serif text-2xl text-white">
            {editingTrainer ? "Edit Trainer" : "Add Trainer"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">Name</label>

              <input
                name="name"
                defaultValue={editingTrainer?.user.name || ""}
                required
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">Email</label>

              <input
                name="email"
                type="email"
                defaultValue={editingTrainer?.user.email || ""}
                required
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            {/* Password */}
            {!editingTrainer && (
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

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">Phone</label>

              <input
                name="phone"
                defaultValue={editingTrainer?.phone || ""}
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Specialty
              </label>

              <input
                name="specialty"
                defaultValue={editingTrainer?.specialty || ""}
                placeholder="e.g. Strength Training"
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Profile Image
              </label>

              <input
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setProfileImage(file);
                }}
                className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-white hover:file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-6 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? editingTrainer
                    ? "Updating..."
                    : "Adding..."
                  : editingTrainer
                    ? "Update Trainer"
                    : "Create Trainer"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setProfileImage(null);
                  setEditingTrainer(null);
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
        searchPlaceholder="Search trainer by name, email or specialty..."
      />

      {/* Trainers table */}
      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr className="text-left text-sm text-gray-400">
              <th className="px-6 py-4">Trainer</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Specialty</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTrainers.map((trainer) => (
              <tr
                key={trainer.id}
                className="border-t border-gray-800 transition hover:bg-gray-900"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {trainer.profileImage ? (
                      <img
                        src={trainer.profileImage}
                        alt={trainer.user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm text-gray-400">
                        {trainer.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className="text-white">{trainer.user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {trainer.user.email}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {trainer.phone || "-"}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {trainer.specialty || "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(trainer)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trainer)}
                      disabled={deletingTrainerId !== null}
                      className="text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingTrainerId === trainer.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTrainers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  {search ? "No trainers found." : "No trainers available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
