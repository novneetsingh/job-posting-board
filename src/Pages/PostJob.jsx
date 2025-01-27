import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();

  // Static array of candidate emails
  const candidateEmails = ["novneet100@gmail.com", "novneet200@gmail.com"];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  // Submit job data to backend
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken"); // Get the JWT token from localStorage
      const jobData = { ...data, candidateEmails };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/companies/post-job`,
        jobData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job posted successfully!");
      console.log("Job posted:", response.data);
      reset(); // Clear form fields
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post the job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear token from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
      >
        Logout
      </button>

      {/* Form Container */}
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Post a Job</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              {...register("title", { required: "Job title is required" })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Job Title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              {...register("description", {
                required: "Job description is required",
              })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
              placeholder="Enter Job Description"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              {...register("experienceLevel", {
                required: "Experience level is required",
              })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
            >
              <option value="">Select Experience Level</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
            {errors.experienceLevel && (
              <p className="text-red-500 text-sm">
                {errors.experienceLevel.message}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white rounded`}
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
