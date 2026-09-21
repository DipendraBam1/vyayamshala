import heroImage from "../../assets/Hero.jpeg";

export default function Hero() {
  return (
    <section className="h-[calc(100vh-120px)] bg-background text-foreground">
      <div className="container-custom h-full">
        <div className="grid h-full items-center gap-12 md:grid-cols-2">
          {/* Left Content */}
          <div>
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              Join The World
              <br />
              Of Fitness.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-muted">
              Our aim is to bring more people into fitness and help them achieve
              their fitness goals.
            </p>

            {/* Actions */}
<div className="mt-8 flex items-center gap-8">
  <a
    href="#join"
className="rounded-3xl bg-primary px-7 py-3 text-sm font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 animate-pulse hover:scale-105 hover:animate-none shadow-[0_0_30px_rgba(255,255,255,0.5)]"  >
    Join Now
  </a>
</div>

            {/* Stats */}
            <div className="mt-16 grid max-w-xl grid-cols-3">
              <div>
                <p className="font-serif text-3xl text-primary">7</p>
                <p className="mt-2 text-xs text-muted">Experience</p>
              </div>

              <div>
                <p className="font-serif text-3xl text-primary">15k+</p>
                <p className="mt-2 text-xs text-muted">Happy Customers</p>
              </div>

              <div>
                <p className="font-serif text-3xl text-primary">24</p>
                <p className="mt-2 text-xs text-muted">Gym Trainers</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex h-full items-center justify-end">
            <div className="h-[520px] w-full max-w-[430px] overflow-hidden">
              <img
                src={heroImage}
                alt="Gym"
                className="h-full w-full object-cover"
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
