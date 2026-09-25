import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  CalendarCheck,
  LogOut,
  TagPlus,
  HandPlatter,
  Combine,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Members",
      path: "/admin/members",
      icon: Users,
    },
    {
      name: "Trainers",
      path: "/admin/trainers",
      icon: Dumbbell,
    },
    {
      name: "Membership Plans",
      path: "/admin/membership-plans",
      icon: TagPlus,
    },
    {
      name: "Memberships",
      path: "/admin/memberships",
      icon: CreditCard,
    },
    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: CalendarCheck,
    },
    {
      name: "Services",
      path: "/admin/services",
      icon: HandPlatter,
    },
    {
      name: "Join Requests",
      path: "/admin/join-requests",
      icon: Combine,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-black px-4 sm:hidden">
        <h1 className="font-serif text-xl">
          Vyayam<span className="text-primary">shala</span>
        </h1>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-lg p-2 text-gray-300 hover:bg-gray-900 hover:text-white"
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
          fixed left-0 top-0 z-50 h-screen w-64 border-r border-gray-800
          bg-black p-6 transition-transform duration-300
          sm:translate-x-0
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl">
            Vyayam<span className="text-primary">shala</span>
          </h1>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-900 hover:text-white sm:hidden"
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-10 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-primary text-black"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
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