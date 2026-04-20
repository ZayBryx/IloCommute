// components/EditModal.jsx
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";

const EditModal = ({ route, setIsModalOpen, getRoutes }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      routeNo: route.routeNo,
      routeName: route.routeName,
      routeColor: route.routeColor,
    },
  });

  useEffect(() => {
    reset(route);
  }, [route, reset]);

  const onSubmit = async (formData) => {
    try {
      await axios.patch(`/routes/${route._id}`, formData);
      getRoutes();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update route:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Route</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Route Name</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              {...register("routeName", { required: "Route Name is required" })}
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

          <div className="mb-4">
            <label htmlFor="status" className="block mb-2 text-sm font-medium">
              Select Status
            </label>
            <select
              id="status"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block   
 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("status")}
            >
              <option defaultValue={"empty"} value="empty">
                Empty
              </option>
              <option value="verified">Verified</option>
              <option value="completed">Completed</option>
            </select>
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
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
