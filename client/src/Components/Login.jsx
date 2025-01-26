import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { assets } from '../assets/assets';

const Login = () => {
  const [state, setState] = useState('Login');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [otpSent, setOTPSent] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [otp, setOTP] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <form onSubmit={handleSubmit} className="flex min-h-[80vh] items-center">
        <div className="relative flex flex-col gap-5 m-auto items-start p-8 min-w-[340px] sm:min-w-[400px] border rounded-2xl text-zinc-600 text-sm shadow-xl bg-white">
          {/* Cross Icon */}
          <img  
            src={assets.cross_icon}
            alt="Close"
            className="absolute top-4 right-4 w-3 h-3 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => {
              setState('Login');
              setForgotPasswordMode(false);
              setOTPSent(false);
            }}
          />

          {/* Header */}
          <p className="text-2xl font-semibold text-gray-800">
            {state === 'Sign Up'
              ? 'Create Account'
              : forgotPasswordMode
              ? 'Forgot Password'
              : 'Login'}
          </p>

          {/* Full Name (Sign Up Only) */}
          {state === 'Sign Up' && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                className="mt-1 w-full border border-zinc-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-zinc-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="w-full relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {showPassword ? (
                <EyeInvisibleOutlined
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <EyeOutlined
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>

          {/* Re-Password (Sign Up or Forgot Password Only) */}
          {(state === 'Sign Up' || forgotPasswordMode) && (
            <div className="w-full relative">
              <label className="block text-sm font-medium text-gray-700">Re-Password</label>
              <div className="relative mt-1">
                <input
                  type={showRePassword ? 'text' : 'password'}
                  value={repassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg p-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {showRePassword ? (
                  <EyeInvisibleOutlined
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowRePassword(false)}
                  />
                ) : (
                  <EyeOutlined
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowRePassword(true)}
                  />
                )}
              </div>
            </div>
          )}

          {/* OTP (If Sent) */}
          {otpSent && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="mt-1 w-full border border-zinc-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Buttons */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {state === 'Sign Up'
              ? 'Sign Up'
              : forgotPasswordMode
              ? 'Reset Password'
              : 'Login'}
          </button>
          {!forgotPasswordMode && state !== 'Sign Up' && (
            <button
              type="button"
              onClick={() => setForgotPasswordMode(true)}
              className="text-blue-500 underline text-sm hover:text-blue-600"
            >
              Forgot Password?
            </button>
          )}

          <p className="text-sm text-gray-700">
            {forgotPasswordMode || state === 'Sign Up' ? (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => {
                    setState('Login');
                    setForgotPasswordMode(false);
                    setOTPSent(false);
                  }}
                  className="text-blue-500 underline cursor-pointer hover:text-blue-600"
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Create a new account?{' '}
                <span
                  onClick={() => {
                    setState('Sign Up');
                    setForgotPasswordMode(false);
                    setOTPSent(false);
                  }}
                  className="text-blue-500 underline cursor-pointer hover:text-blue-600"
                >
                  Click here
                </span>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
