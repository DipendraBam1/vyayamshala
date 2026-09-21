import { useEffect, useState } from "react";
import {
  getServices,
  type Service,
} from "../../services/public/service.service";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load services:", error);
      }
    }

    loadServices();
  }, []);

  return (
    <section id="services" className="bg-background py-24 text-foreground">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left */}
          <div>
            <p className="mb-4 font-serif text-sm text-primary">Services</p>

            <h2 className="max-w-xl font-serif text-3xl leading-tight md:text-4xl">
              We provide service that
              <br />
              fits the best for you.
            </h2>

            <p className="mt-7 max-w-xl font-serif text-base leading-7 text-gray-300">
              Strive for greatness with the best, around the best and in the
              best fitness environment available in the city.
            </p>

            <Link
              to="/services"
              className="mt-10 inline-block rounded-full bg-white px-7 py-3 font-serif text-sm text-black transition hover:bg-primary"
            >
              See All
            </Link>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl">
                  {service.icon}
                </div>

                <p className="mt-4 font-serif text-sm text-white">
                  {service.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
