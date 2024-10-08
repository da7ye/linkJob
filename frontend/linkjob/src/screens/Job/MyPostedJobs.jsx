import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

function MyPostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(12); // Number of jobs per page
  const { user } = useSelector((state) => state.auth);
  const token = user?.access;

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/userjobs/', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    })
    .then(response => {
      setJobs(response.data);
    })
    .catch(error => {
      console.error('Error fetching your jobs:', error);
    });
  }, [token]);

  const handleDelete = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      axios.delete(`http://127.0.0.1:8000/api/deletejob/${jobId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setJobs(jobs.filter(job => job.id !== jobId));
      })
      .catch(error => {
        console.error('Error deleting job:', error);
      });
    }
  };

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-16 px-4 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-200 mb-8 text-center">
        My Job Listings
      </h1>
      <div className="space-y-6">
        <Link to={'/postajob'}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-md mb-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          Post A New Job
        </Link>
        {currentJobs.map(job => (
          <div
            key={job.id} // Correctly placed key here
            className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
          >
            <div className="p-6 flex flex-col sm:flex-row items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  <Link 
                    to={`/postedjobs/${job.id}`}  
                    className="hover:text-blue-600"
                    style={{ display: 'block' }} 
                  >
                    {job.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold text-blue-600">Location:</span> {job.location}
                </p>
                <p className="text-gray-700 mb-4">
                  {job.description.length > 80 ? `${job.description.substring(0, 80)}...` : job.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-right mt-4 sm:mt-0">
                <p className="text-gray-500 mb-2">
                  <span className="font-semibold text-green-600">Payment:</span> ${job.payment_expected.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Posted on: {new Date(job.date_posted).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Posted by: {job.employer.first_name} {job.employer.last_name}
                </p>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 shadow-lg hover:shadow-xl transition-shadow"
                >
                  Delete
                </button>
                <Link
  to={`/updatejob/${job.id}`}
  className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-4 shadow-lg hover:shadow-xl transition-shadow ml-2"
>
  Edit {job.id}
</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="inline-flex">
          {[...Array(Math.ceil(jobs.length / jobsPerPage)).keys()].map(number => (
            <button
              key={number + 1} // Added unique key to pagination buttons
              onClick={() => paginate(number + 1)}
              className={`px-4 py-2 mx-1 rounded ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} hover:bg-blue-600 hover:text-white transition-colors duration-300`}
            >
              {number + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default MyPostedJobs;
