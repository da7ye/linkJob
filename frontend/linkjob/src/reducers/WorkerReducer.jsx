import {
    WORKER_DETAIL_REQUEST,
    WORKER_DETAIL_SUCCESS,
    WORKER_DETAIL_FAIL,
    WORKER_CREATE_REVIEW_REQUEST,
    WORKER_CREATE_REVIEW_FAIL,
    WORKER_CREATE_REVIEW_RESET,
    WORKER_CREATE_REVIEW_SUCCESS
  } from "../constants/WorkerConstants";

  
const initialState = {
    worker: {
      reviews: [], // Ensure reviews is an array
    },
    loading: false,
    error: null,
  };


export const workerDetailsReducers = (state={ worker: []}, action)=>{

    switch(action.type){
        case WORKER_DETAIL_REQUEST:
            return {loading:true, ...state};
        case WORKER_DETAIL_SUCCESS:
            return {loading:false, worker: action.payload};
        case WORKER_DETAIL_FAIL:
            return {loading:false, error: action.payload};

        default:
            return state;
    }
} 


/* REDUCER USED IN ProductScreen COMPONENT */
export const workerReviewCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case WORKER_CREATE_REVIEW_REQUEST:
        return {
          loading: true,
        };
  
      case WORKER_CREATE_REVIEW_SUCCESS:
        return {
          loading: false,
          success: true,
        };
  
      case WORKER_CREATE_REVIEW_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
  
      case WORKER_CREATE_REVIEW_RESET:
        return {};
  
      default:
        return state;
    }
  };