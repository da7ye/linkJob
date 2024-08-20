import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register, reset } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });

  const { first_name, last_name, email, password, re_password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== re_password) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        first_name,
        last_name,
        email,
        password,
        re_password,
      };
      dispatch(register(userData));
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
      toast.success(
        "An activation email has been sent to you. Please check your email"
      );
    }

    dispatch(reset())
  }, [isError, isSuccess, user, navigate, dispatch]);

  return (
    <div className="min-h-screen flex justify-center py-24 px-6 sm:px-8 lg:px-10 ">
      <div className="max-w-lg w-full space-y-10">
        <div className="text-center">
          <h1 className="w-full text-6xl font-bold mb-20 text-[#00df9a]">
            linkJob.
          </h1>
          <h2 className="mt-8 text-4xl font-extrabold text-gray-50">
            Create your account
          </h2>
          {isLoading && <Loader />}
          {/* <Loader /></div> */}
        </div>
        <form
          className="space-y-8"
          // onSubmit={handleSubmit}
        >
          <div className="rounded-md shadow-sm space-y-6">
            <div>
              <label htmlFor="first_name" className="sr-only">
                first_name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                autoComplete="first_name"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                placeholder="first_name"
                value={first_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="sr-only">
                last_name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="last_name"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                placeholder="last_name"
                value={last_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                placeholder="Email address"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="re_password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="re_password"
                name="re_password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                placeholder="Confirm Password"
                value={re_password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Already have an account? Sign in
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
