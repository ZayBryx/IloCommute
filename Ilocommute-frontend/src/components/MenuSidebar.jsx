import { useAuth } from "../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-text-white.png";
import { useState } from "react";
import { LoginModal } from ".";
import {
  FaTachometerAlt,
  FaRoute,
  FaUsers,
  FaRecycle,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const MenuSidebar = () => {
  const { authData, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const noSidebarPaths = ["/"];

  if (noSidebarPaths.includes(location.pathname)) {
    return null;
  }

  const links = [
    { path: "/dashboard", label: "Analytics", icon: <FaTachometerAlt /> },
    { path: "/dashboard/users", label: "Users", icon: <FaUsers /> },
    { path: "/dashboard/routes", label: "Routes", icon: <FaRoute /> },
    { path: "/dashboard/stops", label: "Stops", icon: <FaMapMarkerAlt /> },
    {
      path: "/dashboard/recycle-bin",
      label: "Recycle Bin",
      icon: <FaRecycle />,
    },
  ];

  return (
    <div>
      {/* Hamburger Button for Small Screens */}
      <div className="fixed top-0 left-0 z-30 flex items-center justify-between p-4 bg-green-950 w-full md:hidden">
        {/* Logo beside the hamburger button */}
        <Link to={authData.isAuth ? "/dashboard" : "/"} className="ml-4">
          <img src={logo} alt="logo" className="max-h-9" />
        </Link>
        <button
          onClick={() =>
            setIsSidebarOpen(!isSidebarOpen)
          } /* Toggle sidebar when clicked */
          className="text-white"
          aria-label="Open Sidebar"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white text-white shadow-lg flex flex-col justify-between z-20 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-64`}
      >
        <div>
          <div className="items-center justify-center h-16 bg-green-950 shadow-md p-4 hidden sm:flex">
            <Link to={authData.isAuth ? "/dashboard" : "/"}>
              <img src={logo} alt="logo" className="max-w-full max-h-12" />
            </Link>
            {/* Close Button in Sidebar */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white block md:hidden"
              aria-label="Close Sidebar"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>

          <nav className="mt-24 sm:mt-10">
            {authData.isAuth && (
              <ul className="space-y-2">
                <li className="pt-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Dashboard
                </li>
                {links.map(({ path, label, icon }) => (
                  <li key={label}>
                    <Link
                      to={path}
                      onClick={() =>
                        setIsSidebarOpen(false)
                      } /* Close sidebar on link click */
                      className={`text-sm sm:text-base font-medium flex items-center px-4 sm:px-6 py-2 transition-all duration-300 ${
                        location.pathname === path
                          ? "border-l-8 border-green-900 text-green-900 bg-green-50"
                          : "text-gray-400 hover:text-gray-900"
                      }`}
                    >
                      <span className="mr-3 text-lg">{icon}</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </div>

        {authData.isAuth && (
          <div className="mb-4">
            <button
              onClick={signOut}
              className="w-full flex text-xs sm:text-base items-center justify-center py-3 bg-slate-700 hover:bg-slate-900 transition duration-300"
              aria-label="Logout"
            >
              <FaSignOutAlt className="mr-3 text-lg" />
              Logout
            </button>
          </div>
        )}

        {isModalOpen && <LoginModal setIsModalOpen={setIsModalOpen} />}
      </aside>

      {/* Overlay for small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-10 md:hidden"
          onClick={() =>
            setIsSidebarOpen(false)
          } /* Close sidebar when clicking outside */
        />
      )}
    </div>
  );
};

export default MenuSidebar;
