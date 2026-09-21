export default function Navbar() {
  return (
    <nav className="w-full bg-background text-foreground">
      <div className="container-custom flex h-[120px] items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <svg
            width="24"
            height="18"
            viewBox="0 0 24 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6V12M6 4V14M8 7H16M18 4V14M21 6V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <span className="mt-1 font-serif tracking-wide text-[15px]">
            <span className="text-white">Vyayam</span>
            <span className="text-primary">shala</span>
          </span>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 font-serif text-[12px] sm:gap-x-4 sm:text-[13px] md:gap-x-[45px] md:text-[14px]">
          {/* Home */}
          <a
            href="#"
            className="relative flex h-[45px] items-center text-primary"
          >
            Home
            <span className="absolute bottom-0 left-1/2 h-[2px] w-[5px] -translate-x-1/2 bg-primary" />
          </a>

          {/* About */}
          <a href="#services" className="transition-colors hover:text-primary">
            About
          </a>

          {/* Reviews */}
          <a href="#reviews" className="transition-colors hover:text-primary">
            Reviews
          </a>

          {/* Services */}
          <a
            href="#facilities"
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            Services
          </a>

          {/* Contact */}
          <a href="#footer" className="transition-colors hover:text-primary">
            Contact
          </a>
          {/* Login */}
          <a href="/login" className="transition-colors hover:text-primary">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}
