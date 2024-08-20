import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Rating from "../../components/Rating";
import WorkerProfile from "../WorkerProfile";
import MyPostedJobs from "../Job/MyPostedJobs";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, user } = useSelector((state) => state.auth);


  useEffect(() => {
    if (!user) {
      // If no user is logged in, redirect to login page
      navigate("/login");
    } else {
      dispatch(getUserInfo());
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);



  return (
    <>
    <div className="min-h-screen py-8">
      <div className="container mx-auto py-8">
        {/* Status Message */}
        {userInfo?.worker && !userInfo.worker.is_active && (
          <div className="p-4 mb-6 text-white rounded-lg bg-red-900">
            <div className="text-center">
              <h2 className="text-lg font-semibold">Account Not Activated</h2>
              <p>
                Your account has been created, but it has not been activated yet.
                You can check and update your worker info while it's being
                checked, but your profile will not be showing in the providers
                list!
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 px-4">
          {/* Left Section: Profile Photo and Basic Info */}
          <div className="col-span-1 sm:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col items-center">
                {userInfo?.worker?.profile_photo ? (
                  <img
                    src={userInfo.worker.profile_photo}
                    alt="Profile"
                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 object-cover object-center"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-300 flex items-center justify-center text-gray-600 rounded-full mb-4">
                    <span className="text-4xl">No Photo</span>
                  </div>
                )}
                <h1 className="text-xl font-bold">
                  {userInfo.first_name} {userInfo.last_name}
                </h1>
                <p className="text-gray-700">{userInfo.email}</p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/providerprofileupdate"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
              {userInfo?.worker && (
                <>
                  <hr className="my-6 border-t border-gray-300" />
                  <div className="flex flex-col">
                    <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                      Skills
                    </span>
                    {userInfo.worker.categories.length > 0 ? (
                      userInfo.worker.categories.map((category, index) => (
                        <li key={index} className="mb-2">
                          {category.title}
                        </li>
                      ))
                    ) : (
                      <li>No skills listed</li>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Section: Profile Details and Additional Information */}
          <div className="col-span-1 sm:col-span-9">
            <div className="bg-white shadow rounded-lg p-6">
              {/* About Me Section */}
              {userInfo?.worker && (
                <>
                  <h2 className="text-xl font-bold mb-4">About Me</h2>
                  <p className="text-gray-700 mb-6">
                    {userInfo.worker.small_description}
                  </p>

                  {/* Additional Information Section */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">
                      Additional Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">Gender:</span>{" "}
                          {userInfo.worker.gender === "M" ? "Male" : "Female"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Price:</span> $
                          {userInfo.worker.price} {userInfo.worker.payment_type}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">
                            Number of Reviews:
                          </span>{" "}
                          {userInfo.worker.numReviews}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">Phone Number:</span>{" "}
                          {userInfo.worker.num_tel}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Email:</span>{" "}
                          {userInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Extra Images Section */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Extra Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {userInfo.worker.extra_images.length > 0 ? (
                        userInfo.worker.extra_images.map((image, index) => (
                          <img
                            key={index}
                            src={image.image}
                            alt={`Extra Image ${index + 1}`}
                            className="w-full h-auto rounded-lg object-cover"
                          />
                        ))
                      ) : (
                        <p className="text-gray-700">
                          No extra images available.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Experience Section */}
                  <h2 className="text-xl font-bold mt-6 mb-4">Experience</h2>
                  <div className="mb-6">
                    <div className="flex justify-between flex-wrap gap-2 w-full">
                      <span className="text-gray-700 font-bold">
                        Web Developer
                      </span>
                      <p>
                        <span className="text-gray-700 mr-2">
                          at ABC Company
                        </span>
                        <span className="text-gray-700">2017 - 2019</span>
                      </p>
                    </div>
                    <p className="mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed finibus est vitae tortor ullamcorper, ut vestibulum
                      velit convallis. Aenean posuere risus non velit egestas
                      suscipit.
                    </p>
                  </div>

                  {/* Additional Experience */}
                  <div className="mb-6">
                    <div className="flex justify-between flex-wrap gap-2 w-full">
                      <span className="text-gray-700 font-bold">
                        Web Developer
                      </span>
                      <p>
                        <span className="text-gray-700 mr-2">
                          at ABC Company
                        </span>
                        <span className="text-gray-700">2017 - 2019</span>
                      </p>
                    </div>
                    <p className="mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed finibus est vitae tortor ullamcorper, ut vestibulum
                      velit convallis. Aenean posuere risus non velit egestas
                      suscipit.
                    </p>
                  </div>

                  {/* Description Section */}
                  <h2 className="text-xl font-bold mt-6 mb-4">Description</h2>
                  <p className="text-gray-700">{userInfo.worker.description}</p>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Reviews
                    </h2>
                    {userInfo.worker.reviews.length > 0 ? (
                      userInfo.worker.reviews.map((review) => (
                        <div
                          key={review._id}
                          className="mb-6 p-6 border rounded-lg shadow-md bg-white"
                        >
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                              <img
                                src="/path-to-avatar.jpg" // Replace with actual avatar if available
                                alt={review.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div>
                              <strong className="text-xl text-gray-900">
                                {review.name}
                              </strong>
                              <div className="flex items-center text-sm text-gray-600">
                                <Rating value={review.rating} color="#f8e825" />
                                <span className="ml-2">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <hr className="my-4 border-gray-200" />
                          <p className="text-gray-700 text-lg">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No reviews available.</p>
                    )}
                  </div>
                </>
              )}
              {!userInfo?.worker && (
                <div>
                  <h2 className="text-xl font-bold mb-4">User Information</h2>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold">Name:</span>{" "}
                    {userInfo.first_name} {userInfo.last_name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {userInfo.email}
                  </p>
                </div>
              )}
              <h3 className="font-semibold text-center mt-3 -mb-2">
                Find me on
              </h3>
              <div className="flex justify-center items-center gap-6 my-6">
                {/* Social media links */}
              </div>
            </div>
          </div>
        </div>
      </div>
     {/* Worker Profile Component */}
     {userInfo && (
      <MyPostedJobs/>
    )}
    </div>
    </>
  );
};

export default ProfilePage;
