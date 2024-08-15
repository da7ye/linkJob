// reducers/jobReducers.js
import {
    JOB_DETAILS_REQUEST, JOB_DETAILS_SUCCESS, JOB_DETAILS_FAIL,
    COMMENTS_LIST_REQUEST, COMMENTS_LIST_SUCCESS, COMMENTS_LIST_FAIL,
    COMMENT_ADD_REQUEST, COMMENT_ADD_SUCCESS, COMMENT_ADD_FAIL,
    COMMENT_DELETE_REQUEST, COMMENT_DELETE_SUCCESS, COMMENT_DELETE_FAIL, JOB_CREATE_REQUEST, JOB_CREATE_SUCCESS, JOB_CREATE_FAIL, JOB_CREATE_RESET
  } from '../constants/jobConstants';
  

  export const jobCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case JOB_CREATE_REQUEST:
        return { loading: true };
      case JOB_CREATE_SUCCESS:
        return { loading: false, success: true, job: action.payload };
      case JOB_CREATE_FAIL:
        return { loading: false, error: action.payload };
      case JOB_CREATE_RESET:
        return {};
      default:
        return state;
    }
  };

  export const jobDetailsReducer = (state = { job: {} }, action) => {
    switch (action.type) {
      case JOB_DETAILS_REQUEST:
        return { loading: true, job: {} };
      case JOB_DETAILS_SUCCESS:
        return { loading: false, job: action.payload };
      case JOB_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const commentsListReducer = (state = { comments: [] }, action) => {
    switch (action.type) {
      case COMMENTS_LIST_REQUEST:
        return { loading: true, comments: [] };
      case COMMENTS_LIST_SUCCESS:
        return { loading: false, comments: action.payload };
      case COMMENTS_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const commentAddReducer = (state = {}, action) => {
    switch (action.type) {
      case COMMENT_ADD_REQUEST:
        return { loading: true };
      case COMMENT_ADD_SUCCESS:
        return { loading: false, success: true };
      case COMMENT_ADD_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const commentDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case COMMENT_DELETE_REQUEST:
        return { loading: true };
      case COMMENT_DELETE_SUCCESS:
        return {
          loading: false,
          success: true,
          deletedCommentId: action.payload,
        };
      case COMMENT_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  