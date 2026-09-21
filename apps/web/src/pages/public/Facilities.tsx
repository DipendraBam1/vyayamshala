const facilities = [
  {
    title: "Lockers and towels",
    description:
      "Clean, safe and sanitary environment to keep your stuffs.",
    image:
      "https://thumbs.dreamstime.com/b/open-locker-towel-running-shoes-gym-changeroom-white-hanging-metal-door-inside-changing-room-345858930.jpg",
  },
  {
    title: "Free Wifi",
    description:
      "Stay connected to the world while you work yourself out.",
    image:
      "https://png.pngtree.com/png-clipart/20221020/original/pngtree-3d-free-wifi-icon-on-transparent-background-hd-images-png-image_8707219.png",
  },
  {
    title: "Complimentary Drinks",
    description:
      "We make sure that you stay hydrated so that you can push yourself to the limit.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9vHBpYbspw2kQDyRj2GWwyS1FSSFN0h7WWD6xJY7VxA&s",
  },
  {
    title: "Hightech Gym",
    description:
      "Build yourself with the best available equipments in the market.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Changing Room",
    description:
      "Sanitary changing room with proper privacy.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHyl8_NW-L0gIqYlbjNN1NgiUwTGX7pVByTIGapCR2lLBViiMdA8t6ZgE&s=10",
  },
  {
    title: "Personal Trainer",
    description:
      "You benefit from the monthly care of a Personal Trainer.",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Facilities() {
  return (
    <section id="facilities" className="bg-background py-24 text-foreground">
      <div className="container-custom">

        {/* Heading */}
        <h2 className="text-center font-serif text-4xl md:text-5xl">
          Our <span className="text-primary">facilities</span>
        </h2>

        {/* Facilities */}
        <div className="mt-16 grid grid-cols-1 gap-x-14 gap-y-12 md:grid-cols-2 lg:grid-cols-3">

          {facilities.map((facility) => (
            <div
              key={facility.title}
              className="flex gap-4"
            >
              <img
                src={facility.image}
                alt={facility.title}
                className="h-[115px] w-[115px] shrink-0 rounded-lg object-cover"
              />

              <div className="pt-1">
                <h3 className="font-serif text-base">
                  {facility.title}
                </h3>

                <p className="mt-4 font-serif text-sm leading-6 text-gray-300">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}