import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo-transparent.png";

const WaveBackground = () => (
  <svg
    className="absolute bottom-0 left-0 w-full"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="#98FB9899"
      d="M0,128L30,133.3C60,139,120,149,180,160C240,171,300,181,360,192C420,203,480,213,540,202.7C600,192,660,160,720,138.7C780,117,840,107,900,96C960,85,1020,75,1080,74.7C1140,75,1200,85,1260,96C1320,107,1380,117,1410,122.7L1440,128L1440 320L1410 320C1380 320 1320 320 1260 320C1200 320 1140 320 1080 320C1020 320 960 320 900 320C840 320 780 320 720 320C660 320 600 320 540 320C480 320 420 320 360 320C300 320 240 320 180 320C120 320 60 320 30 320H0Z"
    />
  </svg>
);

const Home = () => {
  const { loading, googleLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    await googleLogin();
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-green-400 to-green-600">
      <WaveBackground />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg max-w-sm sm:max-w-md p-8 space-y-6 border border-gray-200 m-4 sm:m-0">
        {/* Logo Section */}
        <img src={logo} alt="IloCommute Logo" className="h-16" />

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Welcome to the IloCommute Admin Portal!
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Please log in to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <button
            type="submit"
            className="w-full border border-green-500 hover:bg-green-400 hover:text-white py-3 rounded-md flex items-center justify-center group transition duration-200"
          >
            <span className="w-5 h-5 mr-2 group-hover:text-white">
              <FcGoogle className="w-5 h-5 transition-all duration-200 group-hover:brightness-0 group-hover:invert" />
            </span>
            Continue with Google
          </button>

          {/* Terms Checkbox */}
          <center>
            <label className="inline-flex items-center justify-center">
              <input
                type="checkbox"
                {...register("terms", {
                  required: "You must agree to the terms and conditions",
                })}
                className="form-checkbox text-green-500 focus:ring-green-500"
              />
              <span className="ml-2 text-gray-700">
                I agree to the terms and conditions
              </span>
            </label>
          </center>

          {/* Error Message */}
          {errors.terms && (
            <p className="text-red-500 text-sm text-center">
              {errors.terms.message}
            </p>
          )}

          {/* Additional Information */}
          <p className="text-sm text-gray-500 text-center">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Home;
