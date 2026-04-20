import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

const DemotionModal = ({ id, setIsModalOpen, name, getUsers }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/admin/users/demote/${id}`, {
        confirmation: data.confirmation,
      });
      toast.success(response.data.message);
      getUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p>
            To confirm, type <strong>{name}-DEMOTE</strong> in the input box
            below.
          </p>
          <center>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Confirm by typing confirmation"
                {...register("confirmation", {
                  required: "This field is required for confirmation.",
                })}
                className="border border-gray-300 rounded py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmation.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Confirm Demotion
            </button>
          </center>
        </form>
      </div>
    </div>
  );
};

export default DemotionModal;
