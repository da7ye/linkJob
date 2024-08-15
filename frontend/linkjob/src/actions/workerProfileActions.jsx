import axios from "axios";
import {
  WORKER_PROFILE_UPDATE_REQUEST,
  WORKER_PROFILE_UPDATE_SUCCESS,
  WORKER_PROFILE_UPDATE_FAIL,
  WORKER_PROFILE_DETAILS_REQUEST,
  WORKER_PROFILE_DETAILS_SUCCESS,
  WORKER_PROFILE_DETAILS_FAIL,
} from "../constants/workerProfileConstants";

export const getWorkerProfile = () => async (dispatch) => {
  try {
    dispatch({ type: WORKER_PROFILE_DETAILS_REQUEST });

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    
    const { data } = await axios.get(
      "http://localhost:8000/api/worker-update/",
      // "https://da7ye.pythonanywhere.com/api/worker-update/",
      // "http://192.168.1.250:8000/api/worker-update/", // for phone testing
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

    dispatch({
      type: WORKER_PROFILE_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: WORKER_PROFILE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateWorkerProfile = (formData) => async (dispatch) => {
  try {
    dispatch({ type: WORKER_PROFILE_UPDATE_REQUEST });

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    // console.log(user);


    await axios.put("http://localhost:8000/api/worker-update/", formData, {
    // await axios.put("https://da7ye.pythonanywhere.com/api/worker-update/", formData, {
      // await axios.put("http://192.168.1.250:8000/api/worker-update/", formData, {    //for phone testing purposes
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: WORKER_PROFILE_UPDATE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: WORKER_PROFILE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
