"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const handleVerification = async () => {
    setIsloading(true);
    try {
      const response = await fetch("/api/users/verify-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ClientVerificationCode: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Verification failed");
    }
    setIsloading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationCode.trim() !== "") {
      handleVerification();
    } else {
      toast.error("Verification code cannot be empty");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-green-400 to-blue-400">
      {isLoading && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 py-2 px-4 rounded-md shadow-md z-50 flex items-center">
          <div className="spinner spinner-2 mr-2"></div>
          <span className="text-sm font-medium text-white">Processing...</span>
        </div>
      )}
      <div className="max-w-md w-full md:max-w-90vw bg-white shadow-lg rounded-lg p-6 animate-fade-in verify-code">
        <h1 className="text-3xl font-semibold mb-4 text-center text-gray-800">
          Verification
        </h1>
        <form onSubmit={handleSubmit} className="p-0">
          <input
            className="w-full sm:w-90% border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block mb-4 px-3 py-2 text-gray-800 placeholder-gray-500 bg-gray-100 focus:outline-none focus:shadow-outline"
            type="number"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            autoComplete="off"
            placeholder="Enter verification code"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors w-full mb-4"
          >
            Verify
          </button>
          <p className="text-gray-700 mb-0">
            <span className="mr-1">Back to</span>
            <Link
              href="/signup"
              className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
