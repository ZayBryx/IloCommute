import { useForm } from "react-hook-form";
import logo from "../assets/logo-transparent.png";
import { useAuth } from "../context/AuthProvider";

const LoginModal = ({ setIsModalOpen }) => {
  const { googleLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    googleLogin();
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-12 rounded shadow-lg max-w-md relative">
        <center>
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <form onSubmit={handleSubmit(onSubmit)}>
       
          <img src={logo} alt="logo" className="max-w-16 max-h-16 mb-4" />
            <h2
              className="text-2xl text-gray-800 font-bold mb-8 "
            >
              Log in to IloCommute Admin Page.
            </h2>
            <div className="mb-4">
              <button
                type="submit"
                className="hover:text-gray-700 hover:border-gray-700 transition duration-200 text-gray-500 font-bold py-3 px-4 rounded-full border border-black-700 w-full inline-flex items-center justify-center"
              >
                <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="google logo"
                  className=" absolute w-8 h-8 left-16"/>
                Continue with Google
              </button>

                <label className="inline-flex items-center mt-12">
                  <input
                    type="checkbox"
                    {...register("terms", {
                      required: "You must agree to the terms and conditions",
                    })}
                    className="form-checkbox text-blue-500"
                  />
                  <span className="ml-3 text-gray-700">
                    I agree to the terms and conditions
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.terms.message}
                  </p>
                )}
             
            </div>
         
        </form>
        </center>
       
      </div>
    </div>
  );
};

export default LoginModal;
