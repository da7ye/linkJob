import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { configureStore } from '@reduxjs/toolkit';
import { categoriesListReducers } from "../reducers/CategoriesReducers";
import authReducer from "../features/auth/authSlice";
import { categoryWorkersListReducers } from "../reducers/CategoryWorkersReducers";
import workerReducer from '../features/worker/workerSlice';
import { workerProfileDetailsReducer, workerProfileUpdateReducer } from "../reducers/workerProfileReducers";
import { workerDetailsReducers, workerReviewCreateReducer } from "../reducers/WorkerReducer";
import { commentAddReducer, commentDeleteReducer, commentsListReducer, jobCreateReducer, jobDetailsReducer } from "../reducers/jobReducers";



const rootReducer = combineReducers({
  categoriesList: categoriesListReducers,
  workerProfileDetails: workerProfileDetailsReducer,
  workerProfileUpdate: workerProfileUpdateReducer,
  listCategoryWorkers: categoryWorkersListReducers,
  auth: authReducer,
  worker: workerReducer,
  workerDetails : workerDetailsReducers,
  workerReviewCreate: workerReviewCreateReducer,

  jobCreate: jobCreateReducer,
  jobDetails: jobDetailsReducer,
  commentsList: commentsListReducer,
  commentAdd: commentAddReducer,
  commentDelete: commentDeleteReducer,

});

const initialState = {}; // You can merge initial states if needed

// Middleware setup
const middleware = [thunk];

// Redux Toolkit store configuration
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...middleware),
  devTools: process.env.NODE_ENV !== 'production', // Use Redux DevTools in development
});

export default store;

