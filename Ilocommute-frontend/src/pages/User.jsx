import { useState, useEffect } from "react";
import axios from "axios";
import {
  PromotionModal,
  UserTable,
  DemotionModal,
  AdminTable,
} from "../components";
import {
  FaUsers,
  FaUserShield,
  FaSortAlphaDown,
  FaSortAlphaUpAlt,
} from "react-icons/fa"; // Icons for Admins, Users, and Promote

const User = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for search and sort functionality for users
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isUserSortedAZ, setIsUserSortedAZ] = useState(true);

  // State for search and sort functionality for admins
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [isAdminSortedAZ, setIsAdminSortedAZ] = useState(true);

  const getUsers = async () => {
    try {
      const response = await axios.get("/admin/users");
      setUsers(response.data.users);
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("ERROR getting Users: " + error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Filter and sort users based on search query (name or email) and A-Z sorting
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) // Include email in the search
    )
    .sort(
      (a, b) =>
        isUserSortedAZ
          ? a.name.localeCompare(b.name) // Sort A-Z
          : b.name.localeCompare(a.name) // Sort Z-A
    );

  // Filter and sort admins based on search query (name or email) and A-Z sorting
  const filteredAdmins = admins
    .filter(
      (admin) =>
        admin.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase()) // Include email in the search
    )
    .sort(
      (a, b) =>
        isAdminSortedAZ
          ? a.name.localeCompare(b.name) // Sort A-Z
          : b.name.localeCompare(a.name) // Sort Z-A
    );

  return (
    <div className="container mx-auto p-4 sm:p-8 pt-24 space-y-8 sm:space-y-12">
      {/* Admins Section */}
      <div className="space-y-4 sm:space-y-8 text-xs sm:text-base">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center space-x-2">
            <FaUserShield className="text-green-500" /> {/* Icon for Admins */}
            <span>Admins</span>
          </h1>
          <div className="flex justify-between items-center mt-4">
            <input
              type="text"
              className="w-full sm:w-72 p-2 border border-gray-300 rounded-md"
              placeholder="Search for an admin (name or email)..."
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
            />
            <button
              className="ml-4 px-3 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              onClick={() => setIsAdminSortedAZ(!isAdminSortedAZ)}
            >
              {isAdminSortedAZ ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />}
            </button>
          </div>
        </div>
        <div>
          <AdminTable admins={filteredAdmins} />
        </div>
      </div>

      {/* Users Section */}
      <div className="space-y-4 sm:space-y-8 text-xs sm:text-base">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center space-x-2">
            <FaUsers className="text-green-500" /> {/* Icon for Users */}
            <span>Users</span>
          </h1>
          <div className="flex items-center">
            <input
              type="text"
              className="w-full sm:w-72 p-2 border border-gray-300 rounded-md"
              placeholder="Search for a user (name or email)..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
            <button
              className="ml-4 px-3 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              onClick={() => setIsUserSortedAZ(!isUserSortedAZ)}
            >
              {isUserSortedAZ ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />}
            </button>
          </div>
        </div>
        <div>
          <UserTable users={filteredUsers} onPromoteClick={handleClick} />
        </div>
      </div>

      {/* Promotion/Demotion Modal */}
      {isModalOpen &&
        selectedUser &&
        (selectedUser.role === "user" ? (
          <PromotionModal
            id={selectedUser._id}
            setIsModalOpen={setIsModalOpen}
            name={selectedUser.name}
            getUsers={getUsers}
          />
        ) : (
          <DemotionModal
            id={selectedUser._id}
            setIsModalOpen={setIsModalOpen}
            name={selectedUser.name}
            getUsers={getUsers}
          />
        ))}
    </div>
  );
};

export default User;
