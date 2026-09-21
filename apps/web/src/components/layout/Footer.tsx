import { SocialIcon } from "react-social-icons";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-background px-6 py-16 text-foreground md:px-12 lg:px-20"
    >
      {/* Main footer */}
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Navigation */}
          <div>
            <nav className="flex flex-col gap-5 font-serif text-base">
              <a href="#home" className="transition hover:text-primary">
                Home
              </a>

              <a href="#about" className="transition hover:text-primary">
                About
              </a>

              <a href="#services" className="transition hover:text-primary">
                Services
              </a>

              <a href="#team" className="transition hover:text-primary">
                Team
              </a>

              <a href="#faqs" className="transition hover:text-primary">
                FAQs
              </a>

              <a href="#careers" className="transition hover:text-primary">
                Careers
              </a>

              <a href="#contact" className="transition hover:text-primary">
                Contact Us
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-2xl">Contact</h3>

            <div className="mt-7 space-y-4 font-serif text-sm">
              <p>Maitidevi, mahakavi marg</p>
              <p>Kathmandu, Nepal</p>
              <p>+977-[0] 61-467701</p>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="h-[230px] w-full overflow-hidden rounded-lg bg-gray-800">
              <iframe
                title="Vyayamshala location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=85.325%2C27.698%2C85.345%2C27.713&layer=mapnik&marker=27.7051%2C85.3354"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t border-gray-800 pt-8 md:flex-row">
          <p className="font-serif text-sm">Copyright © 2026 Vyayamshala</p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              aria-label="Facebook"
              className="transition hover:text-primary"
            >
              <SocialIcon url="https://www.youtube.com" />
            </a>

            <a
              href="#"
              aria-label="Youtube"
              className="transition hover:text-primary"
            >
              <SocialIcon url="https://www.facebook.com" />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="transition hover:text-primary"
            >
              <SocialIcon url="https://www.instagram.com" />
            </a>
          </div>

          <p className="font-serif text-sm">Created by Brandbuilder</p>
        </div>
      </div>
    </footer>
  );
}
