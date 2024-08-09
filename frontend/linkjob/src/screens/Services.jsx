import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../actions/CategoriesAcrions";
import Loader from "../components/Loader";

const ServicesPage = () => {
  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categoriesList);
  const { error, loading, categories } = categoriesList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">
          Welcome, {userInfo.first_name} {userInfo.last_name}. Find a Service
        </h1>
        <div className="max-w-lg mx-auto mb-8">
          <input
            type="text"
            placeholder="Search for services..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-6 py-4 rounded-lg shadow-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : error ? (
          <h3 className="text-center text-red-500">{error}</h3>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleCategoryClick(category._id)}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-40 sm:h-48 md:h-56 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-4 mb-2">
                    {category.description}
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

export default ServicesPage;
