import React, { useState, useEffect, useRef } from 'react';
import { listCategories } from '../../actions/CategoriesAcrions';
import { useDispatch, useSelector } from 'react-redux';
import { createWorker } from '../../features/worker/workerSlice';

const ProviderSignUp = () => {
  const [formData, setFormData] = useState({
    categories: [],
    price: '',
    payment_type: '',
    gender: '',
    profile_photo: null,
    num_tel: '+222',
    small_description: '',
    description: '',
    extra_images: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [profilePreview, setProfilePreview] = useState(null);
  const [extraPreviews, setExtraPreviews] = useState([]);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categoriesList);
  const { categories } = categoriesList;

  const { workers, isLoading, isError, message } = useSelector((state) => state.worker);
  const currentWorker = workers.length > 0 ? workers[0] : null;

  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }
  }, [isError, message]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    if (e.target.name === 'num_tel') {
      const phoneRegex = /^\+222(2|3|4)\d{7}$/;
      if (!phoneRegex.test(formData.num_tel)) {
        setPhoneError('Please enter a valid Mauritanian phone number.');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'profile_photo') {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        profile_photo: file,
      }));
      setProfilePreview(URL.createObjectURL(file));
    } else if (e.target.name === 'extra_images') {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        extra_images: files,
      }));
      setExtraPreviews(files.map(file => URL.createObjectURL(file)));
    }
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
    setSearchTerm(''); // Clear the search term after selecting a category
    setIsDropdownVisible(false); // Close the dropdown
  };

  const handleCategoryRemove = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const validateRequiredFields = () => {
    const errors = {};

    if (!formData.num_tel) {
      errors.num_tel = 'Phone number is required.';
    }
    if (!formData.gender) {
      errors.gender = 'Gender is required.';
    }
    if (!formData.price) {
      errors.price = 'Work Price is required.';
    }
    if (!formData.payment_type) {
      errors.payment_type = 'Payment type is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (phoneError || !validateRequiredFields()) {
      console.error('Form validation errors.');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('num_tel', formData.num_tel);
    formDataToSubmit.append('gender', formData.gender);
    formDataToSubmit.append('price', formData.price);
    formDataToSubmit.append('payment_type', formData.payment_type);

    formDataToSubmit.append('profile_photo', formData.profile_photo || '');
    formDataToSubmit.append('small_description', formData.small_description || '');
    formDataToSubmit.append('description', formData.description || '');
    formData.extra_images.forEach((image) => {
      formDataToSubmit.append('extra_images', image);
    });

    formData.categories.forEach(category => formDataToSubmit.append('categories', category));

    dispatch(createWorker(formDataToSubmit));
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex justify-center items-center py-24 px-6 sm:px-8 lg:px-10">
      <div className="max-w-3xl w-full bg-gray-200 shadow-lg rounded-lg p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-[#00df9a] mb-4">Become a Worker</h1>
          {currentWorker ? (
            <p className="text-red-500 text-lg font-medium">You are already registered as a worker.</p>
          ) : (
            <p className="text-gray-600 text-lg">Fill out the form below to become a worker.</p>
          )}
        </div>
        {!currentWorker && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Field */}
            <div>
              <label htmlFor="num_tel" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                id="num_tel" 
                name="num_tel" 
                type="text" 
                value={formData.num_tel} 
                onChange={handleChange} 
                onBlur={handleBlur}
                required 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-lg" 
                placeholder="Phone Number" 
              />
              {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
              {fieldErrors.num_tel && <p className="text-red-500 text-sm mt-2">{fieldErrors.num_tel}</p>}
            </div>

            {/* Profile Photo Field */}
            <div>
              <label htmlFor="profile_photo" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <input 
                id="profile_photo" 
                name="profile_photo" 
                type="file" 
                onChange={handleFileChange} 
                className="block w-full text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100" 
              />
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="mt-2 h-32 w-32 object-cover rounded-md"
                />
              )}
            </div>

            {/* Extra Images Field */}
            <div>
              <label htmlFor="extra_images" className="block text-sm font-medium text-gray-700 mb-1">Extra Images</label>
              <input 
                id="extra_images" 
                name="extra_images" 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                className="block w-full text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100" 
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {extraPreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Extra Preview ${index + 1}`}
                    className="h-32 w-full object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Categories Field */}
            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-lg mb-2"
                onFocus={() => setIsDropdownVisible(true)}
              />
              {isDropdownVisible && (
                <ul ref={dropdownRef} className="absolute z-10 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {filteredCategories.map((category) => (
                    <li
                      key={category._id}
                      onClick={() => handleCategoryChange(category._id)}
                      className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                    >
                      {category.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Display Selected Categori.es */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Selected Categories:</label>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((categoryId) => {
                  const category = categories.find((cat) => cat._id === categoryId);
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

            {/* Price Field */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Work Price</label>
              <input 
                id="price" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-lg" 
                placeholder="Price" 
              />
              {fieldErrors.price && <p className="text-red-500 text-sm mt-2">{fieldErrors.price}</p>}
            </div>

            {/* Payment Type Field */}
            <div>
              <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
              <select 
                id="payment_type" 
                name="payment_type" 
                value={formData.payment_type} 
                onChange={handleChange} 
                required 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-lg"
              >
                <option value="">Select Payment Type</option>
                <option value="Per Hour">Per Hour</option>
                <option value="Per Mission">Per Mission</option>
              </select>
              {fieldErrors.payment_type && <p className="text-red-500 text-sm mt-2">{fieldErrors.payment_type}</p>}
            </div>

            {/* Gender Field */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select 
                id="gender" 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                required 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-lg"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
              {fieldErrors.gender && <p className="text-red-500 text-sm mt-2">{fieldErrors.gender}</p>}
            </div>

            {/* Small Description Field */}
            <div>
              <label htmlFor="small_description" className="block text-sm font-medium text-gray-700 mb-1">Small Description</label>
              <textarea 
                id="small_description" 
                name="small_description" 
                value={formData.small_description} 
                onChange={handleChange} 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-lg" 
                placeholder="Small Description"
              ></textarea>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-lg" 
                placeholder="Description"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button 
                type="submit" 
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            {/* Error Message */}
            {isError && (
              <div className="text-red-500 text-center text-sm mt-4">{message}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ProviderSignUp;
