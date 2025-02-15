import React, { useContext, useEffect, useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import { motion } from "motion/react";
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import axios from 'axios'
const Login = () => {
  const navigate = useNavigate()
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const { setShowLogin,token,setToken ,backendurl,user,setUser} = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [otpSent, setOTPSent] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [otp, setOTP] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  

  const handleOTPRequest = async () => {
    const loadingNotification = toast.loading("Sending OTP....");
    setTimeout(() => {
      toast.dismiss(loadingNotification);
    }, 5000);
    try {
      const endpoint =
        state === "Sign Up"
          ? "/api/user/register/request-otp"
          : "/api/user/forgot/request-otp";

      const payload =
        state === "Sign Up" ? { name, email, password ,repassword} : { email,password,repassword };

      const { data } = await axios.post(backendurl + endpoint, payload);
      if (data.success) {
        toast.success(data.message);
        setOTPSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const endpoint = otpSent
          ? "/api/user/register/verifyotp-register"
          : "/api/user/register";

        const payload = otpSent
          ? { name, email, password, repassword, otp }
          : { name, email, password };

        const { data } = await axios.post(backendurl + endpoint, payload);
        if (data.success) {
          toast.success(data.message);
          if (otpSent) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setShowLogin(false)
          }
        } else {
          toast.error(data.message);
        }
      } else if (forgotPasswordMode) {
        const endpoint = otpSent
          ? "/api/user/forgot/reset"
          : "/api/user/forgot/request-otp";

        const payload = otpSent
          ? { email, password, repassword, otp }
          : { email };

        const { data } = await axios.post(backendurl + endpoint, payload);
        if (data.success) {
          toast.success(data.message);
          if (otpSent) {
            setForgotPasswordMode(false); // This should disable Forgot Password mode after reset
            setOTPSent(false); // Reset OTP sent status after reset
          } else {
            setOTPSent(true); // OTP is now sent
          }
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendurl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successful!");
          setShowLogin(false)
          
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className=" fixed inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-black/30">
     <motion.form initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit}  className="min-h-[80vh] flex items-center" >
      <div className="bg-white flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg ">
      <img
            src={assets.cross_icon}
            alt="Close"
            className="ml-80 w-3 h-3 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => {
              setState("Login");
              setForgotPasswordMode(false);
              setOTPSent(false);
              setShowLogin(false);
            }}
          />
        <p className="text-2xl font-semibold">
          {state === "Sign Up"
            ? "Create Account"
            : forgotPasswordMode
              ? "Forgot Password"
              : "Login"}
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            value={email}
            placeholder="Enter a Valid Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        </div>

        <div className="w-full relative">
          <p className="text-sm text-gray-700">Password</p>
          <div className="relative">
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder={forgotPasswordMode?"New Password":"Password"}
              onChange={(e) => setPassword(e.target.value)}
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


        {(state === "Sign Up" || forgotPasswordMode) && (
          <div className="w-full relative">
            <p className="text-sm text-gray-700">Re-Password</p>
            <div className="relative">
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type={showRePassword ? 'text' : 'password'}
                value={repassword}
                placeholder={forgotPasswordMode?"New Re-Password":"Re-Password"}
                onChange={(e) => setRePassword(e.target.value)}
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

        {otpSent && (
          <div className="w-full">
            <p>OTP</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              value={otp}
              placeholder="OTP"
              onChange={(e) => setOTP(e.target.value)}
              required
            />
          </div>
        )}

        {state === "Login" && !forgotPasswordMode && !otpSent && (
          <button
            type="submit"
            className="bg-blue-700 text-white w-full py-2 rounded-md text-base"
          >
            Login
          </button>
        )}

        {(state === "Sign Up" || forgotPasswordMode) && !otpSent && (
          <button
            type="button"
            onClick={handleOTPRequest}
            className="bg-blue-700 text-white w-full py-2 rounded-md text-base"
          >
            Send OTP
          </button>
        )}

        {otpSent && (
          <button
            type="submit"
            className="bg-blue-700 text-white w-full py-2 rounded-md text-base"
          >
            {forgotPasswordMode ? "Reset Password" : "Create Account"}
          </button>
        )}

        {!forgotPasswordMode && state !== "Sign Up" && (
          <button
            type="button"
            onClick={() => setForgotPasswordMode(true)}
            className="text-primary underline cursor-pointer"
          >
            Forgot Password?
          </button>
        )}

        {forgotPasswordMode || state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
                setForgotPasswordMode(false);
                setOTPSent(false);
              }}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => {
                setState("Sign Up");
                setForgotPasswordMode(false);
                setOTPSent(false);
              }}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </motion.form>
    </div>
  );
};

export default Login;
