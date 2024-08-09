import React, { useState, useEffect } from 'react';
import { listCategories } from '../../actions/CategoriesAcrions';
import { useDispatch, useSelector } from 'react-redux';
import { createWorker, reset } from '../../features/worker/workerSlice';

const ProviderSignUp = () => {
  const [formData, setFormData] = useState({
    categories: [],
    pricePerHour: '',
    gender: '',
    profile_photo: null,
    num_tel: '+222',  // Prepopulate with country code
    small_description: '',
    description: '',
    extra_images: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state.categoriesList);
  const { error, loading, categories } = categoriesList;

  const { workers, isLoading, isError, message } = useSelector((state) => state.worker);
  const currentWorker = workers.length > 0 ? workers[0] : null;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      console.error('Error:', message);
    }
  }, [isError, message]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'num_tel') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      setFormData((prev) => ({
        ...prev,
        profile_photo: e.target.files[0],
      }));
    } else if (e.target.name === 'extra_images') {
      setFormData((prev) => ({
        ...prev,
        extra_images: Array.from(e.target.files),
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const { options } = e.target;
    const selectedCategories = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData((prev) => ({
      ...prev,
      categories: selectedCategories,
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
    if (!formData.pricePerHour) {
      errors.pricePerHour = 'Price per hour is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentWorker) {
      console.error('You are already a worker.');
      return;
    }

    if (phoneError || !validateRequiredFields()) {
      console.error('Form validation errors.');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('num_tel', formData.num_tel);
    formDataToSubmit.append('gender', formData.gender);
    formDataToSubmit.append('pricePerHour', formData.pricePerHour);

    // Optional fields
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
    <div className="min-h-screen flex justify-center py-24 px-6 sm:px-8 lg:px-10">
      <div className="max-w-lg w-full space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#00df9a]">Become a Worker</h1>
          {currentWorker ? (
            <p className="text-red-500">You are already registered as a worker.</p>
          ) : (
            <p className="text-gray-500">Fill out the form below to become a worker.</p>
          )}
        </div>
        {!currentWorker && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields */}
            <div>
              <label htmlFor="num_tel" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                id="num_tel" 
                name="num_tel" 
                type="text" 
                value={formData.num_tel} 
                onChange={handleChange} 
                onBlur={handleBlur}
                required 
                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg" 
                placeholder="Phone Number" 
              />
              {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
              {fieldErrors.num_tel && <p className="text-red-500 text-sm mt-2">{fieldErrors.num_tel}</p>}
            </div>

            <div>
              <label htmlFor="profile_photo" className="block text-sm font-medium text-gray-700">Profile Photo</label>
              <input id="profile_photo" name="profile_photo" type="file" onChange={handleFileChange} className="block w-full text-gray-900" />
            </div>

            <div>
              <label htmlFor="extra_images" className="block text-sm font-medium text-gray-700">Extra Images</label>
              <input id="extra_images" name="extra_images" type="file" multiple onChange={handleFileChange} className="block w-full text-gray-900" />
            </div>

            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories</label>
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

            <div>
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700">Price Per Hour</label>
              <input 
                id="pricePerHour" 
                name="pricePerHour" 
                type="number" 
                value={formData.pricePerHour} 
                onChange={handleChange} 
                required 
                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg" 
                placeholder="Price Per Hour" 
              />
              {fieldErrors.pricePerHour && <p className="text-red-500 text-sm mt-2">{fieldErrors.pricePerHour}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
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
              {fieldErrors.gender && <p className="text-red-500 text-sm mt-2">{fieldErrors.gender}</p>}
            </div>

            <div>
              <label htmlFor="small_description" className="block text-sm font-medium text-gray-700">Small Description</label>
              <textarea 
                id="small_description" 
                name="small_description" 
                value={formData.small_description} 
                onChange={handleChange} 
                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg" 
                placeholder="Small Description"
              ></textarea>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg" 
                placeholder="Description"
              ></textarea>
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            {isError && (
              <div className="text-red-500 text-center">{message}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ProviderSignUp;
