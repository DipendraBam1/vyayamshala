import { useEffect, useState } from "react";
import { getServices, type Service } from "../../services/public/service.service";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <section className="min-h-screen bg-background py-24 text-foreground">
      <div className="container-custom">
        <div className="mb-16">
          <p className="mb-4 font-serif text-sm text-primary">
            Our Services
          </p>

          <h1 className="font-serif text-4xl md:text-6xl">
            Everything you need
            <br />
            to stay fit.
          </h1>
        </div>

        {loading ? (
          <p className="font-serif text-gray-400">
            Loading services...
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-12 gap-y-14 sm:grid-cols-3 md:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-4xl">
                  {service.icon}
                </div>

                <p className="mt-5 font-serif text-sm text-white">
                  {service.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}