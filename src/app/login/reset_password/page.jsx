"use client"
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetCodeSent, setResetCodeSent] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      toast.error('Email field cannot be empty');
      return;
    }
    try {
      const response = await fetch('/api/users/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setStep(2);
        setResetCodeSent(data.verificationCode);
        toast.success('Verification code sent to your email');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error('Verification code field cannot be empty');
      return;
    }
    try {
      if (parseInt(verificationCode) === resetCodeSent) {
        setStep(3);
        toast.success('Successfully verified');
      } else {
        toast.error('Incorrect verification code');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Password fields cannot be empty');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'PATCH',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-cyan-500
">
      <div className="bg-white py-8 px-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in verify-code">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="p-0">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-lg">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Request Verification Code
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleCodeSubmit} className="p-0">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-lg">Verification Code</label>
              <input
                type="number"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter the verification code"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Verify Code
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="p-0">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-lg">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-lg">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Reset Password
            </button>
          </form>
        )}
        <p className="mt-3">
          <span className="font-bold">Back to</span>
          <Link href="/login" className="text-blue-700 hover:underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}

