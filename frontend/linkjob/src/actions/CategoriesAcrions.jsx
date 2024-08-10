import axios from "axios";
import {
    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,
  } from "../constants/CategoriesConstants";



export const listCategories = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });
    // const { data } = await axios.get("http://127.0.0.1:8000/api/categories/");
    const { data } = await axios.get("https://da7ye.pythonanywhere.com/api/categories/"); //after deployement
    // const { data } = await axios.get("http://192.168.1.113:8000/api/categories/"); //for phone testing!


    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,      
    });

  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
