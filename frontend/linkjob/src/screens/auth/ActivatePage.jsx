import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { activate, reset } from "../../features/auth/authSlice";
import Loader from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";

const ActivatePage = () => {

  const {uid, token} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      uid,
      token
    }
    dispatch(activate(userData));
    toast.success("Your account has been activated you can login now!")
  };

  useEffect(() => {
    if (isError) {
        toast.error(message)
    }

    if (isSuccess) {
        navigate("/login")
    }

    dispatch(reset())


}, [isError, isSuccess, navigate, dispatch])


  return (
    <div className="min-h-screen flex  justify-center  py-24 px-6 sm:px-8 lg:px-10">
      <div className="max-w-lg w-full space-y-10">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="text-center">
            <h1 className="md:text-4xl text-white sm:text-4xl text-4xl md:pb-[80px] pb-[100px] font-bold md:py-6">
              Account Activation Page
            </h1>
            {isLoading && <Loader />}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
            >
              Click to activate your account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivatePage;
