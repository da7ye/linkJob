import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { WORKER_CREATE_REVIEW_RESET } from "../constants/WorkerConstants";
import { listWorkerDetail, createWorkerReview } from "../actions/WokerActions";
import Rating from "../components/Rating";

const WorkerProfile = () => {
  const dispatch = useDispatch();
  const { workerName } = useParams();

  // Accessing the state from Redux store
  const workerDetails = useSelector((state) => state.workerDetails);
  const { error, loading, worker } = workerDetails;
  const authState = useSelector((state) => state.auth || {});
  const { user } = authState;

  // Setting state for rating and comment for the review
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const workerReviewCreate = useSelector((state) => state.workerReviewCreate);
  const {
    success: successWorkerReview,
    loading: loadingWorkerReview,
    error: errorWorkerReview,
  } = workerReviewCreate;

  useEffect(() => {
    // Dispatch action to get worker details and user info
    dispatch(listWorkerDetail(workerName));
  }, [dispatch, workerName]);

  useEffect(() => {
    if (successWorkerReview) {
      setRating(0);
      setComment("");
      dispatch({ type: WORKER_CREATE_REVIEW_RESET });
      dispatch(listWorkerDetail(workerName)); // Refresh worker details
    }
  }, [dispatch, workerName, successWorkerReview]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to leave a review");
    } else {
      dispatch(createWorkerReview(workerName, { rating, comment }));
    }
  };

  return (
    <div className="min-h-screen py-8">
      {loading ? (
        <h2>Loading.......</h2>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 px-4">
            {/* Left Section: Profile Photo and Basic Info */}
            <div className="col-span-1 sm:col-span-3">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col items-center">
                  {worker.profile_photo ? (
                    <img
                      src={worker.profile_photo}
                      alt="Profile"
                      className="w-32 h-32 bg-gray-300 rounded-full mb-4 object-cover object-center"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-300 flex items-center justify-center text-gray-600 rounded-full mb-4">
                      <span className="text-4xl">No Photo</span>
                    </div>
                  )}
                  <h1 className="text-xl font-bold">
                    {worker.user
                      ? `${worker.user.first_name} ${worker.user.last_name}`
                      : workerName}
                  </h1>
                  <p className="text-gray-700">
                    {worker.user && worker.user.email}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <a
                      href="#"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Contact
                    </a>
                    <a
                      href="/"
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                    >
                      Resume
                    </a>
                  </div>
                </div>
                <hr className="my-6 border-t border-gray-300" />
                <div className="flex flex-col">
                  <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                    Skills
                  </span>
                  <ul>
                    {worker.categories && worker.categories.length > 0 ? (
                      worker.categories.map((category, index) => (
                        <li key={index} src={category._id} className="mb-2">
                          {category.title}
                        </li>
                      ))
                    ) : (
                      <li>No skills listed</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Section: Profile Details and Additional Information */}
            <div className="col-span-1 sm:col-span-9">
              <div className="bg-white shadow rounded-lg p-6">
                {/* About Me Section */}
                <h2 className="text-xl font-bold mb-4">About Me</h2>
                <p className="text-gray-700 mb-6">{worker.small_description}</p>

                {/* Additional Information Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">
                    Additional Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Gender:</span>{" "}
                        {worker.gender === "M" ? "Male" : "Female"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Price:</span>{" "}
                        {worker.price || "Not Available"}
                        {worker.payment_type  || "Not Available"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">
                          Number of Reviews:
                        </span>{" "}
                        {worker.numReviews}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Phone Number:</span>{" "}
                        {worker.num_tel}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span>{" "}
                        {worker.user && worker.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extra Images Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Extra Images</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {worker.extra_images && worker.extra_images.length > 0 ? (
                      worker.extra_images.map((image, index) => (
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

                {/* Educations Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 mb-8">
                  <div className="gap-4">
                  <h2 className="text-xl font-bold mb-4">Education</h2>
                    {worker.educations && worker.educations.length > 0 ? (
                      worker.educations.map((education, index) => (
                        <div
                          key={index}
                          // className="w-full h-auto rounded-lg object-cover"
                        >
                          {education.title}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">No Educations available.</p>
                    )}
                  </div>

                  {/* Speaked Languages Section */}
                  <div className="gap-4">
                  <h2 className="text-xl font-bold mb-4">Speaked Languages</h2>
                    {worker.languages && worker.languages.length > 0 ? (
                      worker.languages.map((language, index) => (
                        <div
                          key={index}
                          // className="w-full h-auto rounded-lg object-cover"
                        >
                          {language.name}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">No Speaked Languages available.</p>
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
                      <span className="text-gray-700 mr-2">at ABC Company</span>
                      <span className="text-gray-700">2017 - 2019</span>
                    </p>
                  </div>
                  <p className="mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    finibus est vitae tortor ullamcorper, ut vestibulum velit
                    convallis. Aenean posuere risus non velit egestas suscipit.
                  </p>
                </div>

                {/* Additional Experience */}
                <div className="mb-6">
                  <div className="flex justify-between flex-wrap gap-2 w-full">
                    <span className="text-gray-700 font-bold">
                      Web Developer
                    </span>
                    <p>
                      <span className="text-gray-700 mr-2">at ABC Company</span>
                      <span className="text-gray-700">2017 - 2019</span>
                    </p>
                  </div>
                  <p className="mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    finibus est vitae tortor ullamcorper, ut vestibulum velit
                    convallis. Aenean posuere risus non velit egestas suscipit.
                  </p>
                </div>

                {/* Description Section */}
                <h2 className="text-xl font-bold mt-6 mb-4">Description</h2>
                <p className="text-gray-700">{worker.description}</p>

                {/* Review Section */}
                <div className="bg-gray-300 shadow-lg rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-semibold mb-6">
                    Leave a Review
                  </h2>
                  {loadingWorkerReview && (
                    <h2 className="text-center text-gray-600 mb-4">
                      Submitting...
                    </h2>
                  )}
                  {errorWorkerReview && (
                    <h3 className="text-center text-red-500 mb-4">
                      {errorWorkerReview}
                    </h3>
                  )}
                  {user ? (
                    <form onSubmit={submitHandler}>
                      <div className="mb-6">
                        <label
                          htmlFor="rating"
                          className="block text-lg font-medium mb-2"
                        >
                          Rating
                        </label>
                        <select
                          id="rating"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="comment"
                          className="block text-lg font-medium mb-2"
                        >
                          Comment
                        </label>
                        <textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows="5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Write your review here..."
                        ></textarea>
                      </div>
                      <div className="text-right">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none transition duration-300 ease-in-out"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-center text-red-500">
                      Please log in to leave a review
                    </p>
                  )}
                </div>
                {/* Display Reviews */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Reviews
                  </h2>
                  {worker && worker.reviews && Array.isArray(worker.reviews) ? (
                    worker.reviews.length > 0 ? (
                      worker.reviews.map((review) => (
                        <div
                          key={review._id}
                          className="mb-6 p-6 border rounded-lg shadow-md bg-white"
                        >
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                              {/* Placeholder for user avatar */}
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
                    )
                  ) : (
                    <p className="text-gray-600">No reviews available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerProfile;
