import { useAuth } from "../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-transparent-text.png";
import { useState } from "react";
import { LoginModal } from "../components";

const Header = () => {
  const { authData, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Define paths where you want to hide the sidebar
  const noHeaderPaths = ["/"]; // Assuming Home.jsx is at the root path

  // Conditionally render the sidebar
  if (noHeaderPaths.includes(location.pathname)) {
    return null; // Don't render the sidebar for specified paths
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-green-600 text-white shadow-lg">
        <div className="flex items-center justify-center h-20">
          <Link to={authData.isAuth ? "/dashboard" : "/"}>
            <img src={logo} alt="logo" className="max-w-full max-h-12" />
          </Link>
        </div>

        <nav className="mt-10">
          {!authData.isAuth ? (
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-green-500 rounded transition duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-green-500 rounded transition duration-200"
                  onClick={() => setIsModalOpen(true)}
                  aria-label="Login"
                >
                  Login
                </button>
              </li>
            </ul>
          ) : (
            <ul className="space-y-4">
              <li>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-green-500 rounded transition duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/routes"
                  className="block px-4 py-2 hover:bg-green-500 rounded transition duration-200"
                >
                  Routes
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/users"
                  className="block px-4 py-2 hover:bg-green-500 rounded transition duration-200"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/stops"
                  className="block px-4 py-2 hover:bg-green-500 rounded transition duration-200"
                >
                  Stops
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/recycle-bin"
                  className="block px-4 py-2 hover:bg-green-500 rounded transition duration-200"
                >
                  Recycle Bin
                </Link>
              </li>
              <li>
                <button
                  onClick={signOut}
                  className="block w-full text-left bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 bg-gray-100 min-h-screen">
        {/* You can add your main content here */}
        {/* For example, you can render children components */}
      </main>

      {isModalOpen && <LoginModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default Header;
