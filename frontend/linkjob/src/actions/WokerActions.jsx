import axios from "axios";
import {
  WORKER_DETAIL_REQUEST,
  WORKER_DETAIL_SUCCESS,
  WORKER_DETAIL_FAIL,
  WORKER_CREATE_REVIEW_REQUEST,
  WORKER_CREATE_REVIEW_FAIL,
  WORKER_CREATE_REVIEW_RESET,
  WORKER_CREATE_REVIEW_SUCCESS
} from "../constants/WorkerConstants";


  export const listWorkerDetail = (workerName) => async (dispatch) => {
    try {
      dispatch({ type: WORKER_DETAIL_REQUEST });
      const { data } = await axios.get(`http://127.0.0.1:8000/api/workers/${workerName}`); 
      // const { data } = await axios.get(`http://192.168.1.113:8000/api/workers/${workerName}`); //for phone testing!

  
      dispatch({
        type: WORKER_DETAIL_SUCCESS,
        payload: data,
      });
    } catch(error) {
      dispatch({
        type: WORKER_DETAIL_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
  

/* ACTION CREATOR USED IN CREATING WORKER REVIEWS IN WORKER PROFILE COMPONENT */
export const createWorkerReview = (workerId, review) => async (dispatch, getState) => {
  try {
    dispatch({
      type: WORKER_CREATE_REVIEW_REQUEST,
    });

    // Accessing userInfo from auth slice
    const { auth: { user } } = getState();
    const accessToken = user?.access;

    if (!accessToken) {
      throw new Error("No access token found");
    }

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // Making API call to create worker review
    const { data } = await axios.post(
      `http://127.0.0.1:8000/api/${workerId}/reviews/`,
      // `http://192.168.1.113:8000/api/${workerId}/reviews/`, // for phone testing purposes
      review,
      config
    );

    // Dispatch success action if the request is successful
    dispatch({
      type: WORKER_CREATE_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: WORKER_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};