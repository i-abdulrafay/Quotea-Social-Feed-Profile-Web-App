"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleLogout = () => {
    window.location.href = "http://localhost:3001/auth/login";
  };

  return (
    <nav className="bg-white shadow-sm py-3 px-4 sm:px-8 flex justify-between items-center sticky top-0 z-50">
      <h1
        className="text-2xl sm:text-3xl font-bold text-gray-800"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Quotea
      </h1>

      <div className="flex gap-4 sm:gap-6">
        <Link
          href="/feed"
          className={`hover:text-blue-600 transition text-base sm:text-lg ${
            pathname === "/feed" ? "font-semibold text-blue-600" : "text-gray-700"
          }`}
        >
          Feed
        </Link>
        <Link
          href="/profile"
          className={`hover:text-blue-600 transition text-base sm:text-lg ${
            pathname === "/profile" ? "font-semibold text-blue-600" : "text-gray-700"
          }`}
        >
          Profile
        </Link>
      </div>

      {user && (
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="relative flex items-center focus:outline-none"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          type="button"
        >
          <span className="text-gray-700 font-medium text-base sm:text-lg mr-3">
            {user.name}
          </span>

          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border cursor-pointer"
            />
            <svg
              className={`absolute bottom-0 right-0 w-4 h-4 text-gray-600 bg-white rounded-full border border-gray-300 transition-transform cursor-pointer duration-200 ${
                dropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transformOrigin: "center" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </button>
      )}

      {dropdownOpen && (
        <div className="absolute right-4 top-full mt-2 w-32 bg-white border rounded shadow-lg z-50 ">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            type="button"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
