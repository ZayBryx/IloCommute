import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { RouteTable, AddRouteModal } from "../components";
import { FaPlus, FaSortNumericUp, FaSortNumericDown } from "react-icons/fa"; // Icon for Add button

const RoutePage = () => {
  const [jeepneyRoutes, setJeepneyRoutes] = useState([]);
  const [totalRoutes, setTotalRoutes] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  const getRoutes = useCallback(async () => {
    try {
      const response = await axios.get("/admin/route-logs");
      setJeepneyRoutes(response.data.routes);
      setTotalRoutes(response.data.totalRoutes);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    }
  }, []);

  useEffect(() => {
    getRoutes();
  }, [getRoutes]);

  // Handle sorting the jeepney routes by route number
  const sortedRoutes = [...jeepneyRoutes].sort((a, b) => {
    return sortOrder === "asc" ? a.routeNo - b.routeNo : b.routeNo - a.routeNo;
  });

  // Filter the routes based on the search term
  const filteredRoutes = sortedRoutes.filter((route) =>
    route.routeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRoute = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`/routes/${id}`);
        toast.success("Route Deleted");
        getRoutes(); // Refresh the routes after deletion
      }
    } catch (error) {
      console.error("Failed to delete route:", error);
      toast.error("Failed to delete route");
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 pt-24">
      <div className="text-xs sm:text-base">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end max-w-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-left mb-4 sm:mb-0">
              Manage Routes
            </h1>
            <p className="text-gray-600">Total Routes: {totalRoutes}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex flex-row">
              <input
                type="text"
                placeholder="Search by route name..."
                className="border p-2 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                onClick={() =>
                  setSortOrder((prevOrder) =>
                    prevOrder === "asc" ? "desc" : "asc"
                  )
                }
              >
                {sortOrder === "asc" ? (
                  <FaSortNumericUp />
                ) : (
                  <FaSortNumericDown />
                )}
              </button>
            </div>
            <button
              className="flex items-center bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-green-600 transition duration-200"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus className="mr-2" /> Add Route
            </button>
          </div>
        </div>

        {/* Search and Sort Controls */}

        <div className="rounded-lg mt-4 sm:mt-8">
          <RouteTable
            jeepneyRoutes={filteredRoutes}
            onDelete={handleDeleteRoute}
            getRoutes={getRoutes}
          />
        </div>

        {isAddModalOpen && (
          <AddRouteModal
            setIsModalOpen={setIsAddModalOpen}
            getRoutes={getRoutes}
          />
        )}
      </div>
    </div>
  );
};

export default RoutePage;
