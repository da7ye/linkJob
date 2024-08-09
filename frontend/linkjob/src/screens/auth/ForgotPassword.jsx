import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { resetPassword } from '../../features/auth/authSlice';


const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        "email": "",
      })
    
      const {email} = formData
      const dispatch = useDispatch()
      const navigate = useNavigate()

      const { isLoading, isError, isSuccess ,message } = useSelector((state) => state.auth)

    
      const handleChange = (e) => {
        setFormData( (prev) => ({
          ...prev,
          [e.target.name]: e.target.value
       }) 
       )
      };
    
      const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
          email
        }
        dispatch(resetPassword(userData))
      };

      useEffect( () => {
        if (isError) {
          toast.error(message)
        }
        if (isSuccess) {
          navigate("/")
          toast.success("A reset password email has been sent, check your email")
        }
      }, [isError, isSuccess, message, navigate, dispatch])
    

  return (
    <div className="min-h-screen flex  justify-center  py-24 px-6 sm:px-8 lg:px-10">
      <div className="max-w-lg w-full space-y-10">
        <div className="text-center">
        <h1 className="w-full text-6xl font-bold mb-20 text-[#00df9a]">linkJob.</h1>
          <h2 className="mt-8 text-4xl font-extrabold text-gray-50">
          Forgot your password?
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
                onChange={handleChange}
                value={email}
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
  );
};

export default ForgotPassword;
