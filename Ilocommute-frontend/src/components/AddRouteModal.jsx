// components/AddRouteModal.jsx
import { useForm } from "react-hook-form";
import axios from "axios";

const AddRouteModal = ({ setIsModalOpen, getRoutes }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await axios.post("/routes", formData);
      getRoutes();
      reset();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add route:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white mx-4 p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add New Route</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Route No.</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              {...register("routeNo", {
                required: "Route No. is required",
                validate: (value) =>
                  !isNaN(value) || "Route No. must be a number",
              })}
            />
            {errors.routeNo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.routeNo.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Route Name</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              {...register("routeName", {
                required: "Route Name is required",
                validate: (value) =>
                  typeof value === "string" || "Route Name must be a string",
              })}
            />
            {errors.routeName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.routeName.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Route Color
            </label>
            <input
              type="color"
              className="border border-gray-300 p-2 rounded w-full h-14"
              {...register("routeColor", {
                required: "Route Color is required",
              })}
            />
            {errors.routeColor && (
              <p className="text-red-500 text-sm mt-1">
                {errors.routeColor.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Route
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRouteModal;
