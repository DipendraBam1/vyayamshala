import { useEffect, useState } from "react";
import {
  createExercise,
  deleteExercise,
  getExercises,
  updateExercise,
  type Exercise,
} from "../../services/exercise.service";
import SearchFilter from "../../components/common/SearchFilter";

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletingExerciseId, setDeletingExerciseId] =
    useState<number | null>(null);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] =
    useState<Exercise | null>(null);

  async function loadExercises() {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (error) {
      console.error("Failed to load exercises:", error);
      alert("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExercises();
  }, []);

  function handleAdd() {
    setEditingExercise(null);
    setShowForm(true);
  }

  function handleEdit(exercise: Exercise) {
    setEditingExercise(exercise);
    setShowForm(true);
  }

  async function handleDelete(exercise: Exercise) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${exercise.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingExerciseId(exercise.id);

      await deleteExercise(exercise.id);
      await loadExercises();
    } catch (error: any) {
      console.error("Failed to delete exercise:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete exercise",
      );
    } finally {
      setDeletingExerciseId(null);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const muscleGroup = formData.get("muscleGroup") as string;

    try {
      setSaving(true);

      if (editingExercise) {
        await updateExercise(editingExercise.id, {
          name,
          description,
          muscleGroup,
        });
      } else {
        await createExercise({
          name,
          description,
          muscleGroup,
        });
      }

      setShowForm(false);
      setEditingExercise(null);

      await loadExercises();
    } catch (error: any) {
      console.error("Failed to save exercise:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save exercise",
      );
    } finally {
      setSaving(false);
    }
  }

  const filteredExercises = exercises.filter((exercise) => {
    const searchText = search.toLowerCase();

    return (
      exercise.name.toLowerCase().includes(searchText) ||
      exercise.muscleGroup
        ?.toLowerCase()
        .includes(searchText) ||
      exercise.description
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  if (loading) {
    return (
      <p className="text-gray-400">
        Loading exercises...
      </p>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-white">
            Exercises
          </h1>

          <p className="mt-2 text-gray-400">
            Manage exercises for Vyayamshala members.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-full bg-primary px-6 py-3 font-medium text-black transition hover:opacity-90"
        >
          + Add Exercise
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-6 font-serif text-2xl text-white">
            {editingExercise
              ? "Edit Exercise"
              : "Add Exercise"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Exercise Name
              </label>

              <input
                name="name"
                defaultValue={editingExercise?.name || ""}
                required
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Muscle Group
              </label>

              <input
                name="muscleGroup"
                defaultValue={
                  editingExercise?.muscleGroup || ""
                }
                placeholder="e.g. Chest, Back, Legs"
                className="h-12 w-full rounded-lg border border-gray-700 bg-black px-4 text-white outline-none placeholder:text-gray-600 focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-400">
                Description
              </label>

              <textarea
                name="description"
                defaultValue={
                  editingExercise?.description || ""
                }
                rows={4}
                placeholder="Describe the exercise..."
                className="w-full resize-none rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-primary"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-primary px-6 py-3 font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingExercise
                    ? "Update Exercise"
                    : "Create Exercise"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setShowForm(false);
                  setEditingExercise(null);
                }}
                className="rounded-full border border-gray-700 px-6 py-3 text-white disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search exercise..."
      />

      {/* Exercises Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr className="text-left text-sm text-gray-400">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Muscle Group</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredExercises.map((exercise) => (
              <tr
                key={exercise.id}
                className="border-t border-gray-800 transition hover:bg-gray-900"
              >
                <td className="px-6 py-4 text-white">
                  {exercise.name}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {exercise.muscleGroup || "-"}
                </td>

                <td className="max-w-md px-6 py-4 text-gray-400">
                  {exercise.description || "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(exercise)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(exercise)
                      }
                      disabled={deletingExerciseId !== null}
                      className="text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingExerciseId === exercise.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredExercises.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-500"
                >
                  {search
                    ? "No exercises found."
                    : "No exercises available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}