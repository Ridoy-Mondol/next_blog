"use client"
import { useState } from "react";
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'


function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter()
  const currentRoute = usePathname();
  let className;
  if (currentRoute === '/' || currentRoute === '/articles' || currentRoute.startsWith('/articles')) {
    className = "navForRoute1";
  } else {
    className = "navForRoute2";
  }


  const toggleSidebar = () => {
    setSidebarOpen(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  }
  return (
    <div className={`nav-div flex items-center ${ className}`}>
      <div className={`sidebar-icon ${sidebarOpen ? "d-none" : ""}`}>
      <FontAwesomeIcon icon={faBars} className="cursor-pointer" onClick={toggleSidebar} />
      </div>

      <div className={`sidebar ${sidebarOpen ? "open" : "close"}`}>
        <li>
            <Link href = "/" className="nav-link">
                Home
            </Link>
        </li>
        <li>
            <Link href = "/profile" className="nav-link">
            Profile
            </Link>
        </li>
        <li>
            <Link href = "/articles" className="nav-link">
            Articles
            </Link>
        </li>
        <li>
            <Link href = "/post" className="nav-link">
            Post
            </Link>
        </li>
        <li>
           <button onClick={logout}>
              Log Out
           </button>
         </li>
       </div>

       <div className={`${sidebarOpen ? "sidebar-close" : ""}`} onClick={() => (setSidebarOpen(false))}></div>

      <div className="text-xl ml-14 nav-icon">
        <Link href="/">
        Next Blog
        </Link>
      </div>
      <div className="flex space-x-4 ml-auto list-none mr-14 nav-link-div">
        <li>
            <Link href = "/" className="nav-link">
                Home
            </Link>
        </li>
        <li>
            <Link href = "/profile" className="nav-link">
            Profile
            </Link>
        </li>
        <li>
            <Link href = "/articles" className="nav-link">
            Articles
            </Link>
        </li>
        <li>
            <Link href = "/post" className="nav-link">
            Post
            </Link>
        </li>
        <li>
           <button onClick={logout}>
              Log Out
           </button>
         </li>
       </div>
     </div>
   )
 }

 export default Navbar







