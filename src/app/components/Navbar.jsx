"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  const currentRoute = usePathname();
  const token = getCookie("token2");

  let className;
  if (
    currentRoute === "/" ||
    currentRoute === "/articles" ||
    currentRoute.startsWith("/articles")
  ) {
    className = "navForRoute1";
  } else {
    className = "navForRoute2";
  }

  const toggleSidebar = () => {
    setSidebarOpen(true);
  };

  const logout = () => {
    deleteCookie("token2");
    deleteCookie("next-auth.callback-url");
    deleteCookie("next-auth.csrf-token");
    deleteCookie("next-auth.session-token");
    router.push("/login");
  };

  const isActive = (path) => (currentRoute === path ? "active" : "");

  return (
    <div className={`nav-div flex items-center ${className}`}>
      <div className={`sidebar-icon ${sidebarOpen ? "d-none" : ""}`}>
        <FontAwesomeIcon
          icon={faBars}
          className="cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>

      <div className={`sidebar ${sidebarOpen ? "open" : "close"}`}>
        <li>
          <Link href="/" className={`nav-link ${isActive("/")}`}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/profile" className={`nav-link ${isActive("/profile")}`}>
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/articles"
            className={`nav-link ${isActive("/articles")}`}
          >
            Articles
          </Link>
        </li>
        <li>
          <Link href="/post" className={`nav-link ${isActive("/post")}`}>
            Post
          </Link>
        </li>
        <li>
          <button
            onClick={logout}
            className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none 
        ${
          token
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
          >
            {token ? "Log Out" : "Log In"}
          </button>
        </li>
      </div>

      <div
        className={`${sidebarOpen ? "sidebar-close" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div className="text-xl ml-14 nav-icon">
        <Link href="/">Next Blog</Link>
      </div>
      <div className="flex items-center space-x-4 ml-auto list-none mr-14 nav-link-div">
        <li>
          <Link href="/" className={`nav-link ${isActive("/")}`}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/profile" className={`nav-link ${isActive("/profile")}`}>
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/articles"
            className={`nav-link ${isActive("/articles")}`}
          >
            Articles
          </Link>
        </li>
        <li>
          <Link href="/post" className={`nav-link ${isActive("/post")}`}>
            Post
          </Link>
        </li>
        <li>
          <button
            onClick={logout}
            className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none 
        ${
          token
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
          >
            {token ? "Log Out" : "Log In"}
          </button>
        </li>
      </div>
    </div>
  );
}

export default Navbar;
