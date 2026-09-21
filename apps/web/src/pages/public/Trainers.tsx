import { useEffect, useState } from "react";
import {
  getTrainers,
  type Trainer,
} from "../../services/trainer.service";

export default function TrainersSection() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainers() {
      try {
        const data = await getTrainers();
        setTrainers(data);
      } catch (error) {
        console.error("Failed to load trainers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTrainers();
  }, []);

  return (
    <section
      id="team"
      className="bg-background py-24 text-foreground"
    >
      <div className="container-custom">
        {/* Heading */}
        <div className="mb-14">
          <h2 className="font-serif text-4xl md:text-5xl">
            Meet our{" "}
            <span className="text-primary">Trainers</span>
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-400">
            Loading trainers...
          </p>
        )}

        {/* Empty */}
        {!loading && trainers.length === 0 && (
          <p className="text-gray-400">
            No trainers available.
          </p>
        )}

        {/* Trainers */}
        {!loading && trainers.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="group overflow-hidden"
              >
                {trainer.profileImage ? (
                  <img
                    src={trainer.profileImage}
                    alt={trainer.user.name}
                    className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full items-center justify-center bg-gray-900 text-gray-500">
                    No Image
                  </div>
                )}

                <p className="mt-4 text-center font-serif text-base text-white">
                  {trainer.user.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}