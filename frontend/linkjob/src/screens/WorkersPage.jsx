import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listCategoryWorkers } from "../actions/CategoryWorkersActions";
import Rating from "../components/Rating";

const WorkersPage = () => {
  const dispatch = useDispatch();
  const workersList = useSelector((state) => state.listCategoryWorkers);
  const { error, loading, workers } = workersList;
  const [searchTerm, setSearchTerm] = useState("");
  const { categoryName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listCategoryWorkers(categoryName));
  }, [dispatch, categoryName]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleWorkerClick = (workerId) => {
    navigate(`/workers/${workerId}`);
  };

  const filteredWorkers = workers.filter((worker) =>
    worker.user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-16 ">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12">
          Discover Skilled Workers
        </h1>
        <div className="max-w-lg mx-auto mb-10">
          <input
            type="text"
            placeholder="Search for workers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-5 py-3 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-400 transition duration-300 ease-in-out"
          />
        </div>

        {loading ? (
          <h2 className="text-center text-gray-600">Loading...</h2>
        ) : error ? (
          <h3 className="text-center text-red-500">{error}</h3>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredWorkers.map((worker) => (
              <div
                key={worker._id}
                className="group relative flex flex-col rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleWorkerClick(worker._id)}
              >
                <div className="relative">
                  <img
                    src={worker.profile_photo}
                    alt={`${worker.user.first_name} ${worker.user.last_name}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {worker.user.first_name} {worker.user.last_name}
                  </h3>
                  <Rating
                    value={worker.rating}
                    text={`${worker.numReviews} reviews`}
                    color={"#f8e825"}
                  />
                  <p className="text-gray-600 text-sm mt-3">
                    {worker.small_description}
                  </p>
                </div>
                <div className="p-6 bg-gray-100">
                  <p className="text-lg font-semibold text-gray-900">
                    from {worker.price}{worker.payment_type  || "Not Available"}

                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkersPage;
