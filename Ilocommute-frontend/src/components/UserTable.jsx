import { FaUserPlus } from "react-icons/fa"; // Icon for Promote

const UserTable = ({ users, onPromoteClick }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-blue-50 border-b hidden sm:table-header-group">
          <tr>
            <th className="py-3 px-6 text-left text-blue-700 font-semibold">
              Name
            </th>
            <th className="py-3 px-6 text-left text-blue-700 font-semibold">
              Email
            </th>
            <th className="py-3 px-6 text-left text-blue-700 font-semibold">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user._id} className="border-b flex flex-col sm:table-row">
                <td className="py-3 px-6 text-gray-800 before:content-['Name:'] before:font-semibold before:block sm:before:hidden">
                  {user.name}
                </td>
                <td className="py-3 px-6 text-gray-800 before:content-['Email:'] before:font-semibold before:block sm:before:hidden">
                  {user.email}
                </td>
                <td className="flex justify-end sm:justify-start mt-2 py-3 px-6">
                  <button
                    className="flex items-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                    onClick={() => onPromoteClick(user)}
                  >
                    <FaUserPlus /> {/* Promote Icon */}
                    <span>Promote</span>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
