import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MemberLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-800 bg-gray-950 p-6">
        <div className="mb-10">
          <span className="font-serif text-2xl">Vyayam</span>
          <span className="font-serif text-2xl text-primary">shala</span>
          <p className="mt-1 text-sm text-gray-500">Member Panel</p>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/member/dashboard"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/member/membership"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`
            }
          >
            My Membership
          </NavLink>

          <NavLink
            to="/member/attendance"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`
            }
          >
            My Attendance
          </NavLink>

          <NavLink
            to="/member/exercises"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`
            }
          >
            Exercises
          </NavLink>

          <NavLink
            to="/member/diet-plans"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`
            }
          >
            Diet Plans
          </NavLink>
          <NavLink
            to="/member/review"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`
            }
          >
            Give Review
          </NavLink>
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
