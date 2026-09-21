import { useState } from "react";
import { createJoinRequest } from "../../services/public/joinRequest.service";
 export default function JoinFamily() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

 async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>,
) {
  e.preventDefault();

  try {
    await createJoinRequest(name, phone);

    alert("Thank you! We will contact you soon.");

    setName("");
    setPhone("");
  } catch (error) {
    console.error("Failed to submit join request:", error);

    alert("Failed to submit your request. Please try again.");
  }
}

  return (
    <section id="join" className="bg-background py-24">
      <div className="container-custom">
        <h2 className="font-serif flex items-center justify-center mb-8 text-white text-3xl md:text-4xl">
          What's<span className="mx-2 text-primary">Stopping</span> You ?
        </h2>
        <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-2">
          {/* Image */}
             <img
              src="https://www.ritfitsports.com/cdn/shop/articles/build-the-best-home-gym-essential-equipment-smart-setup-guide_d8b70e45-f67e-4d3a-9e19-ae59c8da6044.webp?v=1779087554&width=1500"
              alt="Gym workout"
              className="h-full w-full object-cover"
            />
 
          {/* Form */}
          <div className="flex items-center bg-[#f8f6ef] px-8 py-12 text-black md:px-16 lg:px-20">
            <div className="w-full max-w-[500px]">
              <h2 className="font-serif text-3xl md:text-4xl">
                Become a part of our family
              </h2>

              <p className="mt-6 font-serif text-base">
                Leave your details and we will get back to you !
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-gray-400 bg-transparent px-5 font-serif outline-none transition focus:border-black"
                />

                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-gray-400 bg-transparent px-5 font-serif outline-none transition focus:border-black"
                />

                <button
                  type="submit"
                  className="rounded-full bg-primary px-7 py-3 font-serif text-sm transition duration-300 hover:scale-105"
                >
                  Join Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
