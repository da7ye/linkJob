import {
    WORKER_PROFILE_UPDATE_REQUEST,
    WORKER_PROFILE_UPDATE_SUCCESS,
    WORKER_PROFILE_UPDATE_FAIL,
    WORKER_PROFILE_DETAILS_REQUEST,
    WORKER_PROFILE_DETAILS_SUCCESS,
    WORKER_PROFILE_DETAILS_FAIL,
  } from '../constants/workerProfileConstants';
  
  export const workerProfileDetailsReducer = (state = { worker: {} }, action) => {
    switch (action.type) {
      case WORKER_PROFILE_DETAILS_REQUEST:
        return { loading: true, worker: {} };
      case WORKER_PROFILE_DETAILS_SUCCESS:
        return { loading: false, worker: action.payload };
      case WORKER_PROFILE_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const workerProfileUpdateReducer = (state = {}, action) => {
    switch (action.type) {
      case WORKER_PROFILE_UPDATE_REQUEST:
        return { loading: true };
      case WORKER_PROFILE_UPDATE_SUCCESS:
        return { loading: false, success: true };
      case WORKER_PROFILE_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  