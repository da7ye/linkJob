import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetPasswordConfirm } from "../../features/auth/authSlice";
import Loader from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";


function ResetPassword() {
  const { uid, token } = useParams();

  const [formData, setFormData] = useState({
    'new_password': '',
    're_new_password': ''
  });

  const {new_password, re_new_password} = formData
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess ,message } = useSelector((state) => state.auth)

    
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    const userData = {
      uid,
      token,
      new_password,
      re_new_password
    }
    dispatch(resetPasswordConfirm(userData))
  };



  useEffect( () => {
    
    if (new_password !== re_new_password) {
      toast.error("Passwords do not match");
    } else {
      if (isError) {
        toast.error(message)
      }
      if (isSuccess) {
        navigate("/login")
        toast.success("Your password was successfully reset")
      }
    }
  }, [isError, isSuccess, message, navigate, dispatch])

  return (
    <div>
      <div className="min-h-screen flex  justify-center  py-24 px-6 sm:px-8 lg:px-10">
        <div className="max-w-lg w-full space-y-10">
          <div className="text-center">
            <h1 className="w-full text-6xl font-bold mb-20 text-[#00df9a]">
              linkJob.
            </h1>
            <h2 className="mt-8 text-4xl font-extrabold text-gray-50">
              Reset Password
            </h2>
          </div>
          {isLoading && <Loader />}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-6">
                <label htmlFor="new_password" className="sr-only">
                  New Password
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  autoComplete="new_password"
                  required
                  className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                  placeholder="New password"
                  value={new_password}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="re_new_password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="re_new_password"
                  name="re_new_password"
                  type="password"
                  autoComplete="confirm-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                  placeholder="confirm password"
                  onChange={handleChange}
                  value={re_new_password}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
