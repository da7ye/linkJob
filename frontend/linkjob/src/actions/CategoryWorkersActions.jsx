import axios from "axios";
import {
    WORKERS_LIST_REQUEST,
    WORKERS_LIST_SUCCESS,
    WORKERS_LIST_FAIL,
  } from "../constants/CategoryWorkersConstants";


export const listCategoryWorkers = (categoryName) => async (dispatch) => {
    try {
      dispatch({ type: WORKERS_LIST_REQUEST });
      // const { data } = await axios.get(`http://127.0.0.1:8000/api/categoryProviders/${categoryName}/`);
      const { data } = await axios.get(`https://da7ye.pythonanywhere.com/api/categoryProviders/${categoryName}/`); //after deployement
      // const { data } = await axios.get(`http://192.168.1.113:8000/api/categoryProviders/${categoryName}/`); //for phone testing!

  
      dispatch({
        type: WORKERS_LIST_SUCCESS,
        payload: data.workers,
      });
      
    console.log(data);
    } catch(error) {
      dispatch({
        type: WORKERS_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
