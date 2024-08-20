import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { useSelector } from "react-redux";

function UpdateJob() {
    const { job_id } = useParams();
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [jobData, setJobData] = useState({
      title: '',
      description: '',
      location: '',
      payment_expected: '',
      speaked_luanguages: '',
      payment_type: '',
      tools_needed: '',
    });
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
      })
      .catch(error => {
        console.error('Error fetching job data:', error);
      });
    }, [job_id, token]);
  
    const handleChange = (e) => {
      setJobData({
        ...jobData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.put(`http://127.0.0.1:8000/api/updatejob/${job_id}/`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log('Job updated successfully:', response.data);
        navigate('/profile'); // Use navigate instead of history.push
      })
      .catch(error => {
        console.error('Error updating job:', error);
      });
    };
  
  return (
    <div className="container mx-auto py-16 px-4 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-200 mb-8 text-center">
        Update Job Listing
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300">Job Title</label>
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Description</label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-300">Location</label>
          <input
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Payment Expected</label>
          <input
            type="number"
            name="payment_expected"
            value={jobData.payment_expected}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300">Spoken Languages</label>
          <select
            name="speaked_luanguages"
            value={jobData.speaked_luanguages}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200"
            required
          >
            <option value="arabe">العربية</option>
            <option value="francais">Français</option>
            <option value="english">English</option>
            <option value="polar">Polar</option>
            <option value="wolof">Wolof</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Payment Type</label>
          <select
            name="payment_type"
            value={jobData.payment_type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200"
          >
            <option value="Per Hour">Per Hour</option>
            <option value="Per Mission">Per Mission</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300">Tools Needed</label>
          <textarea
            name="tools_needed"
            value={jobData.tools_needed}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-md mt-4 shadow-lg hover:shadow-xl transition-shadow"
        >
          Update Job
        </button>
      </form>
    </div>
  );
}

export default UpdateJob;
