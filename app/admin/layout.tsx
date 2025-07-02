import Link from "next/link";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-brand-800 to-brand-900 text-white">
        <div className="p-5">
          <Link href="/admin" className="text-xl font-bold">
            Admin Dashboard
          </Link>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                href="/admin/topics"
                className="block py-2 px-4 rounded hover:bg-brand-700 transition-colors"
              >
                Topics
              </Link>
            </li>
            <li>
              <Link
                href="/admin/learning-paths"
                className="block py-2 px-4 rounded hover:bg-brand-700 transition-colors"
              >
                Learning Paths
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
