import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TrainerLayout() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/trainer/dashboard",
    },
    {
      name: "Exercises",
      path: "/trainer/exercises",
    },
    {
      name: "Diet Plans",
      path: "/trainer/diet-plans",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950 px-4 sm:hidden">
        <div>
          <span className="font-serif text-xl text-white">Vyayam</span>
          <span className="font-serif text-xl text-primary">shala</span>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-lg p-2 text-gray-300 transition hover:bg-gray-900 hover:text-white"
          aria-label="Toggle navigation"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 sm:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          border-r border-gray-800 bg-gray-950 p-6
          transition-transform duration-300
          sm:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="font-serif text-2xl">
              <span className="text-white">Vyayam</span>
              <span className="text-primary">shala</span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Trainer Panel
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-900 hover:text-white sm:hidden"
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-primary text-black"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="absolute bottom-6 left-6 flex items-center gap-3 text-gray-400 transition hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen p-4 pt-20 sm:ml-64 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}