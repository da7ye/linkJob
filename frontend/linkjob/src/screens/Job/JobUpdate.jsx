import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function UpdateJob() {
  const { job_id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    more_details: '',
    location: '',
    payment_expected: '',
    categories_interested: [],
    num_tel: '',
    speaked_luanguages: '',
    payment_type: '',
    tools_needed: '',
    extra_images: [] // Initialize as an empty array
  });
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const token = user?.access;

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/jobs/${job_id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setJobData(response.data);
      setExistingImages(response.data.extra_images || []);
    })
    .catch(error => {
      console.error('Error fetching job data:', error);
    });
  }, [job_id, token]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const newFiles = Array.from(files);
      setJobData((prev) => ({
        ...prev,
        extra_images: [...(prev.extra_images || []), ...newFiles], // Ensure prev.extra_images is an array
      }));
      setImagePreviews((prev) => [
        ...prev,
        ...newFiles.map(file => URL.createObjectURL(file))
      ]);
    } else {
      setJobData({
        ...jobData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title Validation
    if (!jobData.title) newErrors.title = "Title is required";

    // Description Validation
    if (!jobData.description) {
      newErrors.description = "Description is required";
    } else if (jobData.description.length < 25) {
      newErrors.description = "Description must be at least 25 characters long";
    }

    // Location Validation
    if (!jobData.location) newErrors.location = "Location is required";

    // Payment Expected Validation
    if (!jobData.payment_expected) newErrors.payment_expected = "Payment expected is required";

    // Phone Number Validation
    const phonePattern = /^\+222\d{8}$/;
    if (!phonePattern.test(jobData.num_tel)) {
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
    for (const key in jobData) {
      if (key === 'extra_images') {
        jobData[key].forEach((file) => {
          form.append('extra_images', file);
        });
      } else if (Array.isArray(jobData[key])) {
        jobData[key].forEach((item) => form.append(key, item));
      } else {
        form.append(key, jobData[key]);
      }
    }

    form.append('existing_images', JSON.stringify(existingImages));

    axios.put(`http://127.0.0.1:8000/api/updatejob/${job_id}/`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      console.log('Job updated successfully:', response.data);
      navigate('/profile');
    })
    .catch(error => {
      console.error('Error updating job:', error);
    });
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      const updatedExistingImages = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedExistingImages);
    } else {
      const updatedImages = jobData.extra_images.filter((_, i) => i !== index);
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setJobData((prev) => ({
        ...prev,
        extra_images: updatedImages,
      }));
      setImagePreviews(updatedPreviews);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 border-[0px] border-gray-950 rounded-md shadow-md">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white my-12">Update Job Listing</h1>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-1" htmlFor="title">
            Job Title
          </label>
          <p className="text-sm text-gray-500 mb-2">Enter a brief title for the job you're posting.</p>
          <input
            id="title"
            name="title"
            type="text"
            value={jobData.title}
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
            name="num_tel"
            type="tel"
            value={jobData.num_tel}
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
            name="description"
            value={jobData.description}
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
            name="more_details"
            value={jobData.more_details}
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
            name="location"
            type="text"
            value={jobData.location}
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
            Payment Expected
          </label>
          <p className="text-sm text-gray-500 mb-2">Indicate the payment amount expected for this job.</p>
          <input
            id="payment_expected"
            name="payment_expected"
            type="number"
            value={jobData.payment_expected}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.payment_expected ? 'border-red-500' : ''}`}
            placeholder="Payment expected"
            required
          />
          {errors.payment_expected && <p className="text-red-500 text-sm mt-1">{errors.payment_expected}</p>}
        </div>

        {/* Spoken Languages */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-1" htmlFor="speaked_luanguages">
            Spoken Languages
          </label>
          <p className="text-sm text-gray-500 mb-2">Specify the languages required for this job.</p>
          <select
            id="speaked_luanguages"
            name="speaked_luanguages"
            value={jobData.speaked_luanguages}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
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
          <p className="text-sm text-gray-500 mb-2">Choose how the payment will be structured.</p>
          <select
            id="payment_type"
            name="payment_type"
            value={jobData.payment_type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Per Hour">Per Hour</option>
            <option value="Per Mission">Per Mission</option>
          </select>
        </div>

        {/* Tools Needed */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-1" htmlFor="tools_needed">
            Tools Needed
          </label>
          <p className="text-sm text-gray-500 mb-2">List any tools or equipment required for the job.</p>
          <textarea
            id="tools_needed"
            name="tools_needed"
            value={jobData.tools_needed}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="List of tools"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-1">
            Upload Images (Optional)
          </label>
          <p className="text-sm text-gray-500 mb-2">Add up to 3 images that help describe the job.</p>
          
          {/* Existing Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {existingImages.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt={`Job Preview ${index + 1}`} className="h-32 w-full object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, true)}
                  className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-1 hover:bg-red-700"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* New Images */}
          <input
            type="file"
            name="extra_images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 mt-2"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt={`Job Preview ${index + 1}`} className="h-32 w-full object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-1 hover:bg-red-700"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          Update Job
        </button>
      </form>
    </div>
  );
}

export default UpdateJob;
