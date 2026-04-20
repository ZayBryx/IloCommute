import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

const PromotionModal = ({ id, setIsModalOpen, name, getUsers }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/admin/users/${id}`, {
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
      <div className="bg-white mx-4 p-6 rounded shadow-lg max-w-md relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p>
            To confirm, type <strong>{name}-PROMOTE</strong> in the input box
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Confirm Promotion
            </button>
          </center>
        </form>
      </div>
    </div>
  );
};

export default PromotionModal;
