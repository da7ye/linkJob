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
    num_tel: "+222",
    speaked_luanguages: "english",
    payment_type: "Per Hour",
    tools_needed: "",
    extra_images: []
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobCreate = useSelector((state) => state.jobCreate);
  const { loading, error, success } = jobCreate;
  const { userInfo, user } = useSelector((state) => state.auth);

  const categoriesList = useSelector((state) => state.categoriesList);
  const { categories } = categoriesList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    const { options } = e.target;
    const selectedCategories = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData((prev) => ({
      ...prev,
      categories_interested: selectedCategories,
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked, multiple, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else if (type === "file") {
      if (multiple) {
        const newFiles = Array.from(files);
        setFormData((prev) => ({
          ...prev,
          [id]: newFiles,
        }));
        // Create previews for selected images
        setImagePreviews(newFiles.map(file => URL.createObjectURL(file)));
      } else {
        setFormData((prev) => ({
          ...prev,
          [id]: files[0],
        }));
      }
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

  const handleRemoveImage = (index) => {
    const updatedImages = formData.extra_images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      extra_images: updatedImages,
    }));
    setImagePreviews(updatedPreviews);
  };

  const validateForm = () => {
    const newErrors = {};
  
    // Title Validation
    if (!formData.title) newErrors.title = "Title is required";
  
    // Description Validation
    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 25) {
      newErrors.description = "Description must be at least 25 characters long";
    }
  
    // Location Validation
    if (!formData.location) newErrors.location = "Location is required";
  
    // Payment Expected Validation
    if (!formData.payment_expected) newErrors.payment_expected = "Payment expected is required";
  
    // Phone Number Validation
    const phonePattern = /^\+222\d{8}$/;
    if (!phonePattern.test(formData.num_tel)) {
      newErrors.num_tel = "Phone number must be in the format +222XXXXXXXX (where X is a digit)";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      if (key === 'extra_images') {
        formData[key].forEach((file) => {
          form.append('extra_images', file);
        });
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => form.append(key, item));
      } else {
        form.append(key, formData[key]);
      }
    }

    const token = user?.access;
    dispatch(createJob(form, token));
  };

  useEffect(() => {
    if (success) {
      navigate("/postedjobs");
    }
  }, [success, navigate]);
  

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 border-[0px] border-gray-950 rounded-md shadow-md">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white my-12">Post a Job</h1>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-1" htmlFor="title">
              Job Title
            </label>
            <p className="text-sm text-gray-500 mb-2">Enter a brief title for the job you're posting.</p>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter job title"
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Phone Number */}
<div className="mb-6">
  <label className="block text-white font-semibold mb-1" htmlFor="num_tel">
    Phone Number
  </label>
  <p className="text-sm text-gray-500 mb-2">Enter an active phone number to be contacted on.</p>
  <input
    id="num_tel"
    type="tel"
    value={formData.num_tel}
    onChange={handleChange}
    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.num_tel ? 'border-red-500' : ''}`}
  />
  {errors.num_tel && <p className="text-red-500 text-sm mt-1">{errors.num_tel}</p>}
</div>

{/* Description */}
<div className="mb-6">
  <label className="block text-white font-semibold mb-1" htmlFor="description">
    Description
  </label>
  <p className="text-sm text-gray-500 mb-2">Provide a detailed description of the job requirements.</p>
  <textarea
    id="description"
    value={formData.description}
    onChange={handleChange}
    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
    placeholder="Describe what you need"
    required
  ></textarea>
  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
</div>

          {/* More Details */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-1" htmlFor="more_details">
              More Details (Optional)
            </label>
            <p className="text-sm text-gray-500 mb-2">Add any additional details that might help applicants.</p>
            <textarea
              id="more_details"
              value={formData.more_details}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any additional details..."
            ></textarea>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-1" htmlFor="location">
              Location
            </label>
            <p className="text-sm text-gray-500 mb-2">Specify where the job will be performed.</p>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.location ? 'border-red-500' : ''}`}
              placeholder="Job location"
              required
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Payment Expected */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-1" htmlFor="payment_expected">
              Payment Expected ($)
            </label>
            <p className="text-sm text-gray-500 mb-2">Indicate the amount you are willing to pay for the job.</p>
            <input
              id="payment_expected"
              type="number"
              value={formData.payment_expected}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.payment_expected ? 'border-red-500' : ''}`}
              placeholder="Expected payment"
              required
            />
            {errors.payment_expected && <p className="text-red-500 text-sm mt-1">{errors.payment_expected}</p>}
          </div>

          {/* Categories Interested */}
          <div className="mb-6">
            {/* <label className="block text-white font-semibold mb-1" htmlFor="categories_interested">
              Categories
            </label>
            <p className="text-sm text-gray-500 mb-2">Select relevant categories for your job.</p>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
            />
            <select
              id="categories_interested"
              multiple
              value={formData.categories_interested}
              onChange={handleCategoryChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div> */}
          <label className="block text-white font-semibold mb-1" htmlFor="categories_interested">
              Categories
            </label>
            <p className="text-sm text-gray-500 mb-2">Select relevant categories for your job.</p>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                />
              <select id="categories" name="categories" multiple onChange={handleCategoryChange} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {filteredCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

          {/* Spoken Languages */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-1" htmlFor="speaked_languages">
              Spoken Languages
            </label>
            <p className="text-sm text-gray-500 mb-2">Specify the required languages for this job.</p>
            <select
              id="speaked_languages"
              value={formData.speaked_languages}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <label className="block text-white font-semibold mb-1" htmlFor="payment_type">
              Payment Type
            </label>
            <p className="text-sm text-gray-500 mb-2">Specify how the payment will be structured.</p>
            <select
              id="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Per Hour">Per Hour</option>
              <option value="Per Project">Per Project</option>
            </select>
          </div>

          {/* Tools Needed */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-1" htmlFor="tools_needed">
              Tools Needed
            </label>
            <p className="text-sm text-gray-500 mb-2">List any tools or software required to complete the job.</p>
            <input
              id="tools_needed"
              type="text"
              value={formData.tools_needed}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="List any tools needed"
            />
          </div>

          {/* Extra Images */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2" htmlFor="extra_images">
              Upload Extra Images (Optional)
            </label>
            <p className="text-sm text-gray-500 mb-4">Upload any additional images that might be helpful.</p>
            <div className="relative w-full md:w-1/5 h-16">
              <input
                id="extra_images"
                type="file"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                multiple
              />
              <div className="flex items-center justify-center p-3 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                <svg
                  className="w-6 h-6 mr-2 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V9.414a1 1 0 00-.293-.707l-5-5A1 1 0 0011.586 3H4zm5 3a1 1 0 011-1h2v2a1 1 0 001 1h2v7H4V4h4v2a1 1 0 001 1zM8 9a3 3 0 100 6 3 3 0 000-6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Click to upload images</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full md:w-1/3 lg:w-1/5 p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostAJob;
