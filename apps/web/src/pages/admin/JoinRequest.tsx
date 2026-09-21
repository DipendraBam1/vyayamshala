import { useEffect, useState } from "react";
import {
  deleteJoinRequest,
  getJoinRequests,
  type JoinRequest,
} from "../../services/public/joinRequest.service";

export default function JoinRequests() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadRequests() {
    try {
      const data = await getJoinRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to load join requests:", error);
      alert("Failed to load join requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleDelete(request: JoinRequest) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the request from ${request.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(request.id);

      await deleteJoinRequest(request.id);
      await loadRequests();
    } catch (error) {
      console.error("Failed to delete request:", error);
      alert("Failed to delete request");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-NP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <p className="text-gray-400">
        Loading join requests...
      </p>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-white">
          Join Requests
        </h1>

        <p className="mt-2 text-gray-400">
          People who are interested in joining Vyayamshala.
        </p>
      </div>

      {/* Requests count */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-gray-950 p-5">
        <p className="text-sm text-gray-400">
          Total Requests
        </p>

        <p className="mt-1 font-serif text-3xl text-primary">
          {requests.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr className="text-left text-sm text-gray-400">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-t border-gray-800 transition hover:bg-gray-900"
              >
                <td className="px-6 py-4 text-white">
                  {request.name}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {request.phone}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {formatDate(request.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(request)}
                    disabled={deletingId !== null}
                    className="text-red-500 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === request.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-gray-500"
                >
                  No join requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}