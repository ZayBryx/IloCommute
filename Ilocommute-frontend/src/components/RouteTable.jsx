import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditModal } from "../components";
import { FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import { getStatusColor, formatLastChange } from "../helper";

const RouteTable = ({ jeepneyRoutes, onDelete, getRoutes }) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleEditClick = (route) => {
    setSelectedRoute(route);
    setIsEditModalOpen(true);
  };

  return (
    <div className="overflow-auto max-w-full">
      <table className="min-w-full hidden sm:table table-auto border-spacing-0 border border-gray-200 bg-white">
        <thead className="bg-green-50">
          <tr>
            <th className="py-4 px-6 text-left text-green-700 font-semibold">
              Route Number
            </th>
            <th className="py-4 px-6 text-left text-green-700 font-semibold">
              Route Name
            </th>
            <th className="py-4 px-6 text-left text-green-700 font-semibold">
              Route Color
            </th>
            <th className="py-4 px-6 text-left text-green-700 font-semibold">
              Status
            </th>
            <th className="py-4 px-6 text-left text-green-700 font-semibold">
              Last Change
            </th>
            <th className="py-4 px-6 text-left text-green-700 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {jeepneyRoutes.map((route) => (
            <tr key={route._id} className="border-b hover:bg-gray-100">
              <td className="py-4 px-6">{route.routeNo}</td>
              <td className="py-4 px-6 max-w-[200px]">
                <div className="relative group">
                  <p className="truncate">{route.routeName}</p>
                  {/* Tooltip */}
                  <div className="hidden group-hover:block absolute z-50 left-0 -top-8 bg-gray-900 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                    {route.routeName}
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <input
                  type="color"
                  value={route.routeColor}
                  readOnly
                  className="cursor-pointer h-8 w-12 border border-gray-300 rounded"
                />
              </td>
              <td className={`py-4 px-6 ${getStatusColor(route.status)}`}>
                <p className="capitalize">{route.status || "Empty"}</p>
              </td>
              <td className="py-4 px-6 text-sm text-gray-600">
                {formatLastChange(route.lastChange)}
              </td>
              <td className="py-4 px-6 flex space-x-3">
                <button
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                  onClick={() => handleEditClick(route)}
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>

                <button
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                  onClick={() => onDelete(route._id)}
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>

                <button
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all ml-auto"
                  onClick={() => navigate(`/map/${route._id}`)}
                >
                  <FaMapMarkerAlt className="mr-2" />
                  Manage Waypoints
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile view - update with new fields */}
      <div className="block sm:hidden space-y-4">
        {jeepneyRoutes.map((route) => (
          <div
            key={route._id}
            className="border border-gray-200 bg-white rounded-lg p-4"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Route Number:</span>
              <span>{route.routeNo}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Route Name:</span>
              <div className="relative group max-w-[200px]">
                <p className="truncate text-right">{route.routeName}</p>
                {/* Tooltip */}
                <div className="hidden group-hover:block absolute z-50 right-0 -top-8 bg-gray-900 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                  {route.routeName}
                </div>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Route Color:</span>
              <input
                type="color"
                name="color"
                id="color"
                value={route.routeColor || "#FFFFFF"}
                readOnly
                className="cursor-pointer h-6 w-12 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Status:</span>
              <span className={getStatusColor(route.status)}>
                {route.status || "Empty"}
              </span>
            </div>
            <div className="border-t mt-2 pt-2">
              <p className="font-semibold mb-1">Last Change:</p>
              <p className="text-sm text-gray-600">
                {formatLastChange(route.lastChange)}
              </p>
            </div>
            <div className="flex justify-between mt-4 gap-2">
              <button
                className="flex w-full justify-center items-center bg-white text-gray-500 border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-500 hover:text-white transition-all"
                onClick={() => handleEditClick(route)}
              >
                <FaEdit className="mr-1" />
                Edit
              </button>

              <button
                className="flex w-full justify-center items-center bg-white text-red-500 border border-red-300 px-3 py-2 rounded-md hover:bg-red-500 hover:text-white transition-all"
                onClick={() => onDelete(route._id)}
              >
                <FaTrash className="mr-1" />
                Delete
              </button>

              <button
                className="flex w-full justify-center items-center bg-white text-green-500 border border-green-300 px-3 py-2 rounded-md hover:bg-green-500 hover:text-white transition-all"
                onClick={() => navigate(`/map/${route._id}`)}
              >
                <FaMapMarkerAlt className="mr-1" />
                Waypoints
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <EditModal
          route={selectedRoute}
          setIsModalOpen={setIsEditModalOpen}
          getRoutes={getRoutes}
        />
      )}
    </div>
  );
};

export default RouteTable;
