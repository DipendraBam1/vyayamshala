import { useEffect, useState } from "react";
import {
  getMyMembership,
  type MemberMembership,
} from "../../services/member/memberMembership.service";

export default function Membership() {
  const [membership, setMembership] =
    useState<MemberMembership | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembership() {
      try {
        const data = await getMyMembership();
        setMembership(data);
      } catch (error) {
        console.error("Failed to load membership:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMembership();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="h-1 w-10 animate-pulse rounded bg-gray-800" />

            <div className="h-3 w-28 animate-pulse rounded bg-gray-800" />
          </div>

          <div className="mt-5 h-12 w-64 animate-pulse rounded bg-gray-800" />

          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-900" />
        </div>

        <div className="max-w-4xl animate-pulse overflow-hidden rounded-2xl border border-gray-800 bg-gray-950">
          <div className="border-b border-gray-800 p-8">
            <div className="h-3 w-24 rounded bg-gray-800" />
            <div className="mt-4 h-9 w-48 rounded bg-gray-800" />
          </div>

          <div className="grid gap-px bg-gray-800 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 bg-gray-950 p-7"
              >
                <div className="h-3 w-20 rounded bg-gray-900" />
                <div className="mt-3 h-6 w-28 rounded bg-gray-900" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div>
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="h-1 w-10 bg-primary" />

            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Membership
            </span>
          </div>

          <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
            My Membership
          </h1>

          <p className="mt-3 text-gray-400">
            View your current membership details.
          </p>
        </div>

        <div className="max-w-4xl rounded-2xl border border-gray-800 bg-gray-950 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gray-700 bg-gray-900">
            <span className="text-xl text-gray-500">—</span>
          </div>

          <h2 className="mt-5 font-serif text-2xl text-white">
            No Active Membership
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            You currently do not have an active membership at Vyayamshala.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">

        <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
          My Membership
        </h1>

        <p className="mt-3 text-gray-400">
          View your current membership plan and details.
        </p>
                <div className="flex items-center gap-3">
          <div className="h-1 w-10 bg-primary" />

          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Membership
          </span>
        </div>
      </div>

      {/* Membership Card */}
<div className="group max-w-4xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-gray-900">        {/* Plan Header */}
        <div className="border-b border-gray-800 p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
                Current Plan
              </p>

<h2 className="mt-2 font-serif text-3xl text-white transition group-hover:text-primary md:text-4xl">                {membership.plan.name}
              </h2>
            </div>

            <span className="inline-flex w-fit rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black">
              {membership.status}
            </span>
          </div>
        </div>

        {/* Membership Details */}
        <div className="grid gap-px bg-gray-800 md:grid-cols-2">
          <div className="bg-gray-950 p-7">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Price
            </p>

            <p className="mt-2 font-serif text-2xl text-primary">
              Rs. {membership.plan.price}
            </p>
          </div>

          <div className="bg-gray-950 p-7">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Duration
            </p>

            <p className="mt-2 text-lg text-white">
              {membership.plan.duration}{" "}
              <span className="text-gray-400">
                {membership.plan.durationUnit}
              </span>
            </p>
          </div>

          <div className="bg-gray-950 p-7">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Start Date
            </p>

            <p className="mt-2 text-lg text-white">
              {membership.startDate}
            </p>
          </div>

          <div className="bg-gray-950 p-7">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              End Date
            </p>

            <p className="mt-2 text-lg text-white">
              {membership.endDate}
            </p>
          </div>
        </div>

        {/* Description */}
        {membership.plan.description && (
          <div className="border-t border-gray-800 p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              About This Plan
            </p>

            <p className="mt-3 max-w-2xl leading-7 text-gray-400">
              {membership.plan.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}