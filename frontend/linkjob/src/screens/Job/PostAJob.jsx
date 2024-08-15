import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJob } from "../../actions/JobActions";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../features/auth/authSlice";
import { listCategories } from '../../actions/CategoriesAcrions';


const PostAJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    more_details: "",
    location: "",
    payment_expected: "",
    categories_interested: [],
    num_tel: "",
    speaked_luanguages: "english",
    payment_type: "Per Hour",
    tools_needed: "",
  });

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobCreate = useSelector((state) => state.jobCreate);
  const { loading, error, success } = jobCreate;
  const { userInfo, user } = useSelector((state) => state.auth);

  const categoriesList = useSelector((state) => state.categoriesList);
  const {  categories } = categoriesList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    const { options } = e.target;
    const selectedCategories = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
  
    // Ensure categories_interested is an array
    setFormData((prev) => ({
      ...prev,
      categories_interested: selectedCategories,
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked, multiple } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [id]: e.target.files[0],
      }));
    } else if (multiple) {
      setFormData((prev) => ({
        ...prev,
        [id]: [...e.target.options].filter(option => option.selected).map(option => option.value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const form = new FormData();
  for (const key in formData) {
    if (Array.isArray(formData[key])) {
      formData[key].forEach((item, index) => form.append(`${key}[]`, item)); // Append arrays as multiple fields
    } else {
      form.append(key, formData[key]);
    }
  }

  const token = user?.access; // Get the access token

  // Dispatch the createJob action, passing the FormData and token
  dispatch(createJob(form, token));
  console.log("Access Token:", token);
};

  if (success) {
    navigate("/postedjobs"); // Redirect to the jobs list after successful creation
  }

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>

        {/* More Details */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="more_details"
          >
            More Details
          </label>
          <textarea
            id="more_details"
            value={formData.more_details}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Payment Expected */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="payment_expected"
          >
            Payment Expected
          </label>
          <input
            id="payment_expected"
            type="number"
            value={formData.payment_expected}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Categories Interested */}
        {/* <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="categories_interested"
          >
            Categories Interested
          </label>
          <input
            id="categories_interested"
            type="text"
            value={formData.categories_interested.join(",")}
            onChange={(e) => handleChange({ target: { id: 'categories_interested', value: e.target.value.split(",") } })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter categories separated by commas"
          />
        </div> */}
        <div>
              <label htmlFor="categories_interested" className="block text-sm font-medium text-gray-700">Categories Interested</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg mb-2"
              />
              <select id="categories" name="categories" multiple onChange={handleCategoryChange} className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg">
                {filteredCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="num_tel"
          >
            Phone Number
          </label>
          <input
            id="num_tel"
            type="tel"
            value={formData.num_tel}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Languages Spoken */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="speaked_luanguages"
          >
            Languages Spoken
          </label>
          <select
            id="speaked_luanguages"
            value={formData.speaked_luanguages}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="arabe">العربية</option>
            <option value="francais">Français</option>
            <option value="english">English</option>
            <option value="polar">Polar</option>
            <option value="wolof">Wolof</option>
          </select>
        </div>

        {/* Payment Type */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="payment_type"
          >
            Payment Type
          </label>
          <select
            id="payment_type"
            value={formData.payment_type}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Per Hour">Per Hour</option>
            <option value="Per Mission">Per Mission</option>
          </select>
        </div>

        {/* Tools Needed */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tools_needed"
          >
            Tools Needed
          </label>
          <input
            id="tools_needed"
            type="text"
            value={formData.tools_needed}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default PostAJob;
