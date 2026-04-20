import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { RecycleBinTable } from "../components";
import { toast } from "react-toastify";

const RecycleBin = () => {
  const [routes, setRoutes] = useState([]);

  const fetchRecycleBinData = async () => {
    try {
      const response = await axios.get("/recycle-bin");
      setRoutes(response.data);
    } catch (error) {
      console.error("Failed to fetch recycle bin data.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete!",
      });

      if (result.isConfirmed) {
        await axios.delete(`/recycle-bin/${id}`);
        toast.success("Route deleted successfully");
        fetchRecycleBinData();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete the route.", "error");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "All routes will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete all!",
      });

      if (result.isConfirmed) {
        await axios.delete("/recycle-bin");
        toast.success("All routes deleted successfully");
        fetchRecycleBinData();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete all routes.", "error");
    }
  };

  const handleRestore = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will restore this route!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, restore!",
      });

      if (result.isConfirmed) {
        await axios.post(`/recycle-bin/${id}`);
        toast.success("Route restored successfully");
        fetchRecycleBinData();
      }
    } catch (error) {
      toast.error("Failed to restore the route.");
    }
  };

  useEffect(() => {
    fetchRecycleBinData();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-8 pt-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Recycle Bin</h1>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={handleDeleteAll}
        >
          Delete All
        </button>
      </div>
      <RecycleBinTable
        routes={routes}
        handleDelete={handleDelete}
        handleDeleteAll={handleDeleteAll}
        handleRestore={handleRestore}
      />
    </div>
  );
};

export default RecycleBin;
