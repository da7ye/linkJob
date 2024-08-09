import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, login, reset } from "../../features/auth/authSlice";
import { toast } from 'react-toastify';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    "email": "",
    "password": "",
})

const { email, password } = formData

const dispatch = useDispatch()
const navigate = useNavigate()

const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

const handleChange = (e) => {
    setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
    })
    )
}

const handleSubmit = (e) => {
    e.preventDefault()

    const userData = {
        email,
        password,
    }
    dispatch(login(userData))
}


useEffect(() => {
    if (isError) {
        toast.error(message)
    }

    if (isSuccess || user) {
        navigate("/")
    }

    dispatch(reset())
    dispatch(getUserInfo())


}, [isError, isSuccess, user, navigate, dispatch])


  return (
    <div className="min-h-screen flex  justify-center  py-24 px-6 sm:px-8 lg:px-10">
      <div className="max-w-lg w-full space-y-10">
        <div className="text-center">
        <h1 className="w-full text-6xl font-bold mb-20 text-[#00df9a]">linkJob.</h1>
          <h2 className="mt-8 text-4xl font-extrabold text-gray-50">
            Sign in to your account
          </h2>
        </div>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-6">
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-3 block text-lg text-gray-500">
                Remember me
              </label>
            </div>

            <div className="text-lg">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
