import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TrainerLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-800 bg-gray-950 p-6">
        <div className="font-serif text-2xl mb-10">
          <span className=" text-white">Vyayam</span>
          <span className="text-primary">shala</span>

          <p className="mt-1 text-sm text-gray-500">Trainer Panel</p>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/trainer/dashboard"
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
            to="/trainer/exercises"
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
            to="/trainer/diet-plans"
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
        </nav>
        <button
          onClick={logout}
          className="absolute bottom-6 left-6 flex items-center gap-3 text-gray-400 transition hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}
