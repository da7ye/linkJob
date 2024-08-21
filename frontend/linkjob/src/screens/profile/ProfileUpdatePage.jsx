import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../../actions/CategoriesAcrions";
import {
  getWorkerProfile,
  updateWorkerProfile,
} from "../../actions/workerProfileActions";
import { getUserInfo } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const WorkerProfileUpdate = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    categories: [],
    price: "",
    payment_type: "",
    gender: "",
    profile_photo: null,
    profile_photo_url: "",
    num_tel: "",
    small_description: "",
    description: "",
    extra_images: null,
    extra_images_url: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categoriesList);
  const {
    loading: categoriesLoading,
    error: categoriesError,
    categories = [],
  } = categoriesList;
  const workerProfileDetails = useSelector(
    (state) => state.workerProfileDetails
  );
  const {
    loading: profileLoading,
    error: profileError,
    worker,
  } = workerProfileDetails;
  const workerProfileUpdate = useSelector((state) => state.workerProfileUpdate);
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = workerProfileUpdate;

  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      // If no user is logged in, redirect to login page
      navigate("/login");
    } else {
      dispatch(getUserInfo());
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    dispatch(listCategories());
    dispatch(getWorkerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (worker) {
      // Map to extract the image URLs from each object in the extra_images array
      const extraImageUrls = worker.extra_images?.map(img => img.image) || [];
      
      setFormData({
        first_name: worker.first_name || '',
        last_name: worker.last_name || '',
        categories: worker.categories || [],
        price: worker.price || '',
        payment_type: worker.payment_type || '',
        gender: worker.gender || '',
        num_tel: worker.num_tel || '',
        small_description: worker.small_description || '',
        description: worker.description || '',
        profile_photo_url: worker.profile_photo || '',
        extra_images_url: extraImageUrls, 
      });
  
      console.log('formData after setting:', {
        first_name: worker.first_name || '',
        last_name: worker.last_name || '',
        categories: worker.categories || [],
        price: worker.price || '',
        payment_type: worker.payment_type || '',
        gender: worker.gender || '',
        num_tel: worker.num_tel || '',
        small_description: worker.small_description || '',
        description: worker.description || '',
        profile_photo_url: worker.profile_photo || '',
        extra_images_url: extraImageUrls, // Log the updated URLs
      });
    }
  }, [worker]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (e.target.name === 'profile_photo') {
        const file = files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                profile_photo: file,
                profile_photo_url: URL.createObjectURL(file),
            }));
        }
    } else if (e.target.name === 'extra_images') {
        const images = files.filter(file => file instanceof File);
        const imageUrls = images.map(image => URL.createObjectURL(image));

        setFormData((prev) => ({
            ...prev,
            extra_images: [...(prev.extra_images || []), ...images], // Append new images to existing ones
            extra_images_url: [...(prev.extra_images_url || []), ...imageUrls], // Append new image URLs
        }));
    }
};
const handleImageRemove = (index) => {
  setFormData((prev) => ({
    ...prev,
    extra_images: prev.extra_images.filter((_, i) => i !== index),
  }));
};

  

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const updatedCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];

      return {
        ...prev,
        categories: updatedCategories,
      };
    });
    setIsDropdownVisible(false); // Close the dropdown when a category is selected
  };

  const handleCategoryRemove = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("first_name", formData.first_name);
    formDataToSubmit.append("last_name", formData.last_name);
    formDataToSubmit.append("num_tel", formData.num_tel);
    formDataToSubmit.append("gender", formData.gender);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("payment_type", formData.payment_type);
  
    if (formData.profile_photo) {
      formDataToSubmit.append("profile_photo", formData.profile_photo);
    }
    formDataToSubmit.append("small_description", formData.small_description);
    formDataToSubmit.append("description", formData.description);
  
    // Handle categories
    formData.categories.forEach((category) =>
      formDataToSubmit.append("categories", category)
    );
  
    // Handle new images (File objects)
    if (formData.extra_images && formData.extra_images.length > 0) {
      formData.extra_images.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSubmit.append(`extra_images[${index}]`, image);
        }
      });
    } else {
      // If no new images are uploaded, send the existing image URLs (if any)
      formData.extra_images_url.forEach((imageUrl, index) =>
        formDataToSubmit.append(`existing_images[${index}]`, imageUrl)
      );
    }
  
    // Log the contents of the FormData
    for (let pair of formDataToSubmit.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }
  
    dispatch(updateWorkerProfile(formDataToSubmit));
  };
  
  


  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (profileLoading || categoriesLoading) return <p>Loading...</p>;
  if (profileError || categoriesError)
    return <p>{profileError || categoriesError}</p>;

  return (
    <div className="min-h-screen flex justify-center py-24 px-6 sm:px-8 lg:px-10">
      <div className="max-w-lg w-full space-y-10">
        <h1 className="text-4xl font-bold text-center mb-4">
          Edit Worker Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Fields */}
          <div>
            <label
              htmlFor="num_tel"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="num_tel"
              name="num_tel"
              type="text"
              value={formData.num_tel}
              onChange={handleChange}
              required
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
          </div>

          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
          </div>

          <div>
            <label
              htmlFor="profile_photo"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Photo
            </label>
            <input
              id="profile_photo"
              name="profile_photo"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-gray-900"
            />
            {formData.profile_photo_url && (
              <img
                src={formData.profile_photo_url}
                alt="Profile"
                className="mt-2 h-24 w-24 object-cover rounded-full"
              />
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-gray-700"
            >
              Categories
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={toggleDropdown}
              placeholder="Search categories..."
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg mb-2"
            />
            {isDropdownVisible && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto border border-gray-300">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category._id}
                      onClick={() => handleCategoryChange(category._id)}
                      className={`cursor-pointer px-4 py-2 hover:bg-indigo-100 ${
                        formData.categories.includes(category._id)
                          ? "bg-indigo-200"
                          : ""
                      }`}
                    >
                      {category.title}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No categories found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Selected Categories:
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((categoryId) => {
                const category = categories.find(
                  (cat) => cat._id === categoryId
                );
                return (
                  <span
                    key={categoryId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                  >
                    {category?.title}
                    <button
                      type="button"
                      onClick={() => handleCategoryRemove(categoryId)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price{" "}
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
          </div>

          <div>
            <label
              htmlFor="payment_type"
              className="block text-sm font-medium text-gray-700"
            >
              payment_type
            </label>
            <select
              id="payment_type"
              name="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              required
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            >
              <option value="">Select payment_type</option>
              <option value="Per Hour">Per Hour</option>
              <option value="Per Mission">Per Mission</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="small_description"
              className="block text-sm font-medium text-gray-700"
            >
              Small Description
            </label>
            <textarea
              id="small_description"
              name="small_description"
              value={formData.small_description}
              onChange={handleChange}
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            ></textarea>
          </div>

          <div>
  <label htmlFor="extra_images" className="block text-sm font-medium text-gray-700">Extra Images</label>
  <input
    id="extra_images"
    name="extra_images"
    type="file"
    multiple
    onChange={handleFileChange}
    className="block w-full text-gray-900"
  />
  {formData.extra_images_url.length > 0 && (
  <div className="mt-2">
    {formData.extra_images_url.map((url, index) => (
      <img
        key={index}
        src={url}
        alt={`Extra ${index}`}
        className="h-24 w-24 object-cover rounded-md mr-2"
      />
    ))}
  </div>
)}
</div>


          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {updateLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>

          {updateError && (
            <div className="text-red-500 text-center">{updateError}</div>
          )}
        </form>
        {updateSuccess && (
          <div className="text-green-500 text-center">
            Profile updated successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerProfileUpdate;
