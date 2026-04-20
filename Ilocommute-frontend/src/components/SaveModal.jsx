import React from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SaveModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (message) => {
    try {
      const waypointsResponse = await axios.patch(`/routes/${data._id}`, {
        waypoints: data.waypoints,
      });

      const logsResponse = await axios.post(`/routes/save-route`, {
        _id: data._id,
        message: message.message,
      });

      if (waypointsResponse.status === 200 && logsResponse.status === 201) {
        toast.success("Route saved successfully", { position: "top-right" });
        navigate("/dashboard/routes");
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data || "An error occurred", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-h-128 p-6 rounded-lg relative w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 min-h-10 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Details</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              {...register("message", { required: "Message is required" })}
              className="w-full h- max-h-64 min-h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter your changes description"
            />
            {errors.message && (
              <span className="text-red-500 text-xs">
                {errors.message.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveModal;
