import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // send email OTP to verify email address before registration 
  const sendEmailOtp = async (email) => {
    if (!email) {
      alert("Please enter a valid email address first!");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/companies/send-email-otp`, { email });
      alert("OTP sent to email!");
    } catch (error) {
      alert("Error sending OTP to email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // send phone OTP to verify phone number before registration
  const sendPhoneOtp = async (phoneNo) => {
    if (!phoneNo) {
      alert("Please enter a valid phone number first!");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/companies/send-phone-otp`, { phoneNo });
      alert("OTP sent to phone!");
    } catch (error) {
      alert("Error sending OTP to phone. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // submit form data to register company
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/companies/register`,
        data
      );
      alert("Company registered successfully!");
      reset(); // Reset form fields
      console.log("Company registered:", response.data);
      navigate("/login"); // Navigate to login page after successful registration
    } catch (error) {
      alert("Error registering company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center gap-2">
              <input
                {...register("email", { required: "Email is required" })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
                placeholder="Email"
              />
              <button
                type="button"
                disabled={loading}
                className={`px-4 py-2 ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded`}
                onClick={() => sendEmailOtp(watch("email"))}
              >
                {loading ? "Sending..." : "Verify"}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center gap-2">
              <input
                {...register("phoneNo", {
                  required: "Phone number is required",
                })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
                placeholder="Phone Number"
                defaultValue="+91"
              />
              <button
                type="button"
                disabled={loading}
                className={`px-4 py-2 ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded`}
                onClick={() => sendPhoneOtp(watch("phoneNo"))}
              >
                {loading ? "Sending..." : "Verify"}
              </button>
            </div>
            {errors.phoneNo && (
              <p className="text-red-500 text-sm">{errors.phoneNo.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Email OTP */}
          <div>
            <input
              {...register("emailOtp", { required: "Email OTP is required" })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Email OTP"
            />
            {errors.emailOtp && (
              <p className="text-red-500 text-sm">{errors.emailOtp.message}</p>
            )}
          </div>

          {/* Phone OTP */}
          <div>
            <input
              {...register("phoneOtp", { required: "Phone OTP is required" })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Phone OTP"
            />
            {errors.phoneOtp && (
              <p className="text-red-500 text-sm">{errors.phoneOtp.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white rounded`}
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already registered?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
