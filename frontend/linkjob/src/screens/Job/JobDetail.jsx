import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from '../../features/auth/authSlice';
import { getJobDetails, listComments, addComment, deleteComment } from '../../actions/JobActions';
import { FaTrashAlt } from 'react-icons/fa';
import ImageModal from '../../components/JobImageModal';



const JobDetail = () => {
  const { id } = useParams(); 
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const { userInfo, user } = useSelector((state) => state.auth || {});

  const accessToken = user?.access;

  const jobDetails = useSelector((state) => state.jobDetails);
  const { loading: jobLoading, error: jobError, job } = jobDetails;

  const commentsList = useSelector((state) => state.commentsList);
  const { loading: commentsLoading, error: commentsError, comments } = commentsList;

  const commentAdd = useSelector((state) => state.commentAdd);
  const { loading: addLoading, error: addError, success: addSuccess } = commentAdd;

  const commentDelete = useSelector((state) => state.commentDelete);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = commentDelete;

  useEffect(() => {
    dispatch(getUserInfo());
    dispatch(getJobDetails(id));
    dispatch(listComments(id));
  }, [dispatch, id, addSuccess, deleteSuccess]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addComment(id, { comment }, accessToken));
    setComment('');
  };

  const handleDelete = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      dispatch(deleteComment(commentId, accessToken));
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (jobLoading || commentsLoading) return <div>Loading...</div>;
  if (jobError || commentsError) return <div>Error: {jobError || commentsError}</div>;

  return (
    <div className="container mx-auto p-8 max-w-8xl">
      <button
        onClick={() => window.history.back()}
        className="bg-gradient-to-r from-blue-700 to-purple-700 text-white px-6 py-2 rounded-full mb-8 shadow-lg hover:shadow-xl transition-transform  hover:scale-105"
      >
        ← Back to Job List
      </button>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">{job.title}</h1>
          <div className="text-lg text-gray-700 space-y-4">
            <p><span className="font-bold text-gray-800">Location:</span> {job.location}</p>
            <p className="leading-relaxed"><span className="font-bold text-gray-800">Description:</span> {job.description}</p>
            <p><span className="font-bold text-gray-800">Payment Expected:</span> {job.payment_expected} UM</p>
            <p><span className="font-bold text-gray-800">Payment Type:</span> {job.payment_type}</p>
            <p><span className="font-bold text-gray-800">Phone Number:</span> {job.num_tel}</p>
            <p><span className="font-bold text-gray-800">Languages Spoken:</span> {job.speaked_luanguages}</p>
            <p><span className="font-bold text-gray-800">More Details:</span> {job.more_details}</p>
            <p><span className="font-bold text-gray-800">Tools Needed:</span> {job.tools_needed || 'None'}</p>
            <p><span className="font-bold text-gray-800">Posted on:</span> {new Date(job.date_posted).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-8 bg-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Extra Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {job.job_extra_images && job.job_extra_images.length > 0 ? (
              job.job_extra_images.map((image, index) => (
                <div 
                  key={index} 
                  className="overflow-hidden rounded-lg shadow-md relative group cursor-pointer"
                  onClick={() => openImageModal(image.image)}
                >
                  <img 
                    src={image.image} 
                    alt={`Job image ${index + 1}`} 
                    className="w-full h-48 object-cover transform transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-lg font-bold">View Image</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No extra images available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">Comments</h2>
        <div className="space-y-8">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment.id || index} className="bg-gray-50 p-6 rounded-lg shadow-lg space-y-4 border-l-4 border-blue-600 relative">
                <div className="flex items-center space-x-4">
                  <img
                    src={comment?.commentator?.profile_photo}
                    alt={comment.name}
                    className="w-14 h-14 object-cover rounded-full shadow-md"
                  />
                  <div>
                    {comment.commentator && comment.commentator.user ? (
                      <Link to={`/workers/${comment.commentator._id}`} className="font-bold text-blue-700 text-lg">
                        {comment.commentator.user.first_name || 'Unknown User'}
                      </Link>
                    ) : (
                      <span className="font-bold text-gray-800 text-lg">
                        {comment.name || 'Anonymous'}
                      </span>
                    )}
                    <p className="text-gray-500 text-sm">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown Date'}{' '}
                      at {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString() : 'Unknown Time'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{comment.comment}</p>
                {user && comment.commentator._id === userInfo?.worker?._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="absolute top-6 right-6 text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
        </div>
        {user ? (
          <div className="mt-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleSubmit}
              className={`bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-105 mt-4 ${addLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={addLoading}
            >
              {addLoading ? 'Adding...' : 'Add Comment'}
            </button>
            {addError && <p className="text-red-600 mt-4">{addError}</p>}
            {deleteError && <p className="text-red-600 mt-4">{deleteError}</p>}
          </div>
        ) : (
          <p className="text-center text-red-600">
            Please log in as a worker to leave a comment!
          </p>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={closeImageModal} 
        imageUrl={selectedImage} 
      />
    </div>
  );
};

export default JobDetail;
