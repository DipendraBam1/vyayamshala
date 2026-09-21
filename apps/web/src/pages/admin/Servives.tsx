import { useEffect, useState } from "react";

import {
  createService,
  deleteService,
  getServices,
  updateService,
  type Service,
} from "../../services/public/service.service";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadServices() {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function resetForm() {
    setName("");
    setIcon("");
    setEditingId(null);
  }

  function handleEdit(service: Service) {
    setEditingId(service.id);
    setName(service.name);
    setIcon(service.icon);
  }

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (!name.trim() || !icon.trim()) {
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateService(editingId, {
          name: name.trim(),
          icon: icon.trim(),
        });
      } else {
        await createService({
          name: name.trim(),
          icon: icon.trim(),
        });
      }

      resetForm();
      await loadServices();
    } catch (error: any) {
      console.error("Failed to save service:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save service",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteService(id);

      setServices((current) =>
        current.filter((service) => service.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-white">
          Services
        </h1>

        <p className="mt-2 text-gray-400">
          Manage the services displayed on the public website.
        </p>
      </div>

      {/* Form */}
      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-950 p-6">
        <h2 className="mb-5 font-serif text-2xl text-white">
          {editingId ? "Edit Service" : "Add Service"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-[1fr_180px_auto]"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Service name"
            className="h-11 rounded-lg border border-gray-700 bg-black px-4 text-white outline-none placeholder:text-gray-500 focus:border-primary"
          />

          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Icon e.g. 🏋️"
            className="h-11 rounded-lg border border-gray-700 bg-black px-4 text-white outline-none placeholder:text-gray-500 focus:border-primary"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update"
                  : "Add"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-700 px-5 py-2 text-white transition hover:bg-gray-900"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services */}
      {loading ? (
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-8 text-center">
          <p className="text-gray-400">
            Loading services...
          </p>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-10 text-center">
          <h3 className="font-serif text-xl text-white">
            No services yet
          </h3>

          <p className="mt-2 text-gray-500">
            Add your first gym service above.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group rounded-xl border border-gray-800 bg-gray-950 p-6 transition hover:-translate-y-1 hover:border-primary/60 hover:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl">
                    {service.icon}
                  </div>

                  <div>
                    <h3 className="font-serif text-xl text-white transition group-hover:text-primary">
                      {service.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Service #{service.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(service)}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white transition hover:border-primary hover:text-primary"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  disabled={deletingId === service.id}
                  className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950 disabled:opacity-50"
                >
                  {deletingId === service.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}