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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();

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
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-800 bg-black p-6">
        <h1 className="font-serif text-2xl">
          Vyayam<span className="text-primary">shala</span>
        </h1>

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
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

        <button
          onClick={logout}
          className="absolute bottom-6 left-6 flex items-center gap-3 text-gray-400 transition hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}
