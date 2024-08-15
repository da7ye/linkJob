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
    <div className="min-h-screen ">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-gray-900 mb-12 tracking-wide">
          Welcome, {userInfo.first_name} {userInfo.last_name}
          <span className="block mt-4 text-blue-600">Find a Service</span>
        </h1>
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 rounded-full shadow-xl border-0 focus:outline-none focus:ring-4 focus:ring-blue-500 text-lg bg-white text-gray-700 placeholder-gray-400"
            />
            <svg
              className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 17a6 6 0 100-12 6 6 0 000 12z"></path>
            </svg>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <h3 className="text-center text-red-500 text-2xl">{error}</h3>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
                onClick={() => handleCategoryClick(category._id)}
              >
                <div className="relative h-48 sm:h-56 md:h-64">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
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
