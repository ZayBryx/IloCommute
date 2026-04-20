import React from "react";

const RecycleBinTable = ({ routes, handleDelete, handleDeleteAll, handleRestore }) => {
  return (
    <div className="flex flex-col mt-8">
      {/* Desktop Table with Scrollable Content */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Route No</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Route Name</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Deleted By</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Deleted On</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 truncate max-w-[200px]">{route.jeepneyRoute.routeNo}</td>
                <td className="py-2 px-4 truncate max-w-[200px]">{route.jeepneyRoute.routeName}</td>
                <td className="py-2 px-4 truncate max-w-[200px]">{route?.deletedBy?.name || "N/A"}</td>
                <td className="py-2 px-4 truncate max-w-[200px]">{new Date(route.deletedOn).toLocaleDateString()}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    onClick={() => handleDelete(route._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                    onClick={() => handleRestore(route._id)}
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards */}
      <div className="sm:hidden space-y-4">
        {routes.map((route) => (
          <div key={route._id} className="border border-gray-200 bg-white rounded-lg p-4 shadow-md space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Route No:</span> 
              <span className="truncate max-w-[200px]">{route.jeepneyRoute.routeNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Route Name:</span> 
              <span className="truncate max-w-[200px]">{route.jeepneyRoute.routeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Deleted By:</span> 
              <span className="truncate max-w-[200px]">{route?.deletedBy?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Deleted On:</span> 
              <span className="truncate max-w-[200px]">{new Date(route.deletedOn).toLocaleDateString()}</span>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 flex-1"
                onClick={() => handleDelete(route._id)}
              >
                Delete
              </button>
              <button
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 flex-1"
                onClick={() => handleRestore(route._id)}
              >
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecycleBinTable;
