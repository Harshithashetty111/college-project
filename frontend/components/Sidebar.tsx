"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Patients", href: "/patients" },
  { name: "Predictions", href: "/predictions" },
  { name: "Reports", href: "/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-slate-900 text-slate-200 flex flex-col">
      
      {/* LOGO / TITLE */}
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-xl font-semibold text-white">
          Glaucoma XAI
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Doctor Portal
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-md text-sm transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t border-slate-800 text-xs text-slate-400">
        Logged in as Doctor
      </div>
    </aside>
  );
}
