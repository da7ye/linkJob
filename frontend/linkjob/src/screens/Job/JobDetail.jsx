import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from '../../features/auth/authSlice';
import { getJobDetails, listComments, addComment, deleteComment } from '../../actions/JobActions';

const JobDetail = () => {
  const { id } = useParams(); 
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const { userInfo, user } = useSelector((state) => state.auth);

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

  if (jobLoading || commentsLoading) return <div>Loading...</div>;
  if (jobError || commentsError) return <div>Error: {jobError || commentsError}</div>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => window.history.back()}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-md mb-6 shadow-lg hover:shadow-xl transition-shadow"
      >
        Back to Job List
      </button>
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{job.title}</h1>
          <div className="text-lg text-gray-600 mb-6 space-y-4">
            <p><span className="font-semibold">Location:</span> {job.location}</p>
            <p className="text-gray-700">{job.description}</p>
            <p><span className="font-semibold">Payment Expected:</span> {job.payment_expected}UM</p>
            <p><span className="font-semibold">Payment Type:</span> {job.payment_type}</p>
            <p><span className="font-semibold">Phone Number:</span> {job.num_tel}</p>
            <p><span className="font-semibold">Languages Spoken:</span> {job.speaked_luanguages}</p>
            <p><span className="font-semibold">More Details:</span> {job.more_details}</p>
            <p><span className="font-semibold">Tools Needed:</span> {job.tools_needed || 'None'}</p>
            <p><span className="font-semibold">Posted on:</span> {new Date(job.date_posted).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="p-8 bg-gray-50">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Extra Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {job.extra_images && job.extra_images.length > 0 ? (
              job.extra_images.map((image, index) => (
                <img 
                  key={index} 
                  src={image.image} 
                  alt={`Job image ${index + 1}`} 
                  className="rounded-lg shadow-md object-cover w-full h-48"
                />
              ))
            ) : (
              <p>No extra images available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Comments</h2>
        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment.id || index} className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={comment?.commentator?.profile_photo}
                    alt={comment.name}
                    className="w-12 h-12 object-cover rounded-full shadow-md"
                  />
                  <div>
                  {comment.commentator && comment.commentator.user ? (
                    <Link to={`/workers/${comment.commentator._id}`} className="font-semibold text-blue-600 text-lg">
                      {comment.commentator.user.first_name || 'Unknown User'}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-600 text-lg">
                      {comment.name || 'Anonymous'}
                    </span>
                  )}

                    <p className="text-gray-500 text-sm">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown Date'}{' '}
                      at {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString() : 'Unknown Time'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
                {user && comment.commentator._id === userInfo?.worker?._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
        <div className="mt-8">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 border rounded-lg mb-4 text-lg"
            rows="4"
            placeholder="Add a comment"
          />
          <button
            onClick={handleSubmit}
            className={`bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition ${addLoading ? 'opacity-50' : ''}`}
            disabled={addLoading}
          >
            {addLoading ? 'Adding...' : 'Add Comment'}
          </button>
          {addError && <p className="text-red-500 mt-4">{addError}</p>}
          {deleteError && <p className="text-red-500 mt-4">{deleteError}</p>}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
