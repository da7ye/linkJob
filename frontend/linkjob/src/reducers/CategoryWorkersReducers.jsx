import {
  WORKERS_LIST_REQUEST,
  WORKERS_LIST_SUCCESS,
  WORKERS_LIST_FAIL,
} from "../constants/CategoryWorkersConstants";

const initialState = { workers: [] };

export const categoryWorkersListReducers = (state = initialState, action) => {
  switch (action.type) {
    case WORKERS_LIST_REQUEST:
      return { loading: true, workers: [] };
    case WORKERS_LIST_SUCCESS:
      return { loading: false, workers: action.payload };
    case WORKERS_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};