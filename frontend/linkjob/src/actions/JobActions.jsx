// actions/jobActions.js
import axios from 'axios';
import {
  JOB_DETAILS_REQUEST, JOB_DETAILS_SUCCESS, JOB_DETAILS_FAIL,
  COMMENTS_LIST_REQUEST, COMMENTS_LIST_SUCCESS, COMMENTS_LIST_FAIL,
  COMMENT_ADD_REQUEST, COMMENT_ADD_SUCCESS, COMMENT_ADD_FAIL,
  COMMENT_DELETE_REQUEST, COMMENT_DELETE_SUCCESS, COMMENT_DELETE_FAIL, JOB_CREATE_REQUEST, JOB_CREATE_SUCCESS, JOB_CREATE_FAIL
} from '../constants/jobConstants';




export const createJob = (jobData, token) => async (dispatch) => {
  try {
    dispatch({ type: JOB_CREATE_REQUEST });

    const config = {
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const { data } = await axios.post(`http://127.0.0.1:8000/api/jobs/postajob/`, jobData, config);
        //  const { data } = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`);
    //     const { data } = await axios.get(`http://192.168.1.250:8000/api/jobs/${id}/`); //phone test

    dispatch({ type: JOB_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: JOB_CREATE_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};

// Add a comment
export const addComment = (id, commentData, accessToken) => async (dispatch) => {
  try {
    dispatch({ type: COMMENT_ADD_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const { data } = await axios.post(`http://127.0.0.1:8000/api/${id}/postcomment/`, commentData, config);
    // const { data } = await axios.post(`http://192.168.1.250:8000/api/${id}/postcomment/`, commentData, config);

    dispatch({
      type: COMMENT_ADD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMMENT_ADD_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};




// Fetch job details
export const getJobDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: JOB_DETAILS_REQUEST });

    const { data } = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`);
    // const { data } = await axios.get(`http://192.168.1.250:8000/api/jobs/${id}/`); //phone test

    dispatch({
      type: JOB_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: JOB_DETAILS_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};

// Fetch comments
export const listComments = (id) => async (dispatch) => {
  try {
    dispatch({ type: COMMENTS_LIST_REQUEST });

    const { data } = await axios.get(`http://127.0.0.1:8000/api/${id}/comments/`);
    // const { data } = await axios.get(`http://192.168.1.250:8000/api/${id}/comments/`); // phone testing

    dispatch({
      type: COMMENTS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMMENTS_LIST_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};



// Delete a comment
export const deleteComment = (commentId, accessToken) => async (dispatch) => {
  try {
    dispatch({ type: COMMENT_DELETE_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios.delete(`http://127.0.0.1:8000/api/comments/${commentId}/delete/`, config);
    // await axios.delete(`http://192.168.1.250:8000/api/comments/${commentId}/delete/`, config);

    dispatch({ type: COMMENT_DELETE_SUCCESS, payload: commentId });
  } catch (error) {
    dispatch({
      type: COMMENT_DELETE_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};
