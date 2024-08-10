// import axios from "axios";
// import {
//     PROVIDERS_LIST_REQUEST,
//     PROVIDERS_LIST_SUCCESS,
//     PROVIDERS_LIST_FAIL,
//   } from "../constants/CategoryProvidersConstants";


// export const listCategoryProviders = (categoryName) => async (dispatch) => {
//     try {
//       dispatch({ type: PROVIDERS_LIST_REQUEST });
//       // const { data } = await axios.get(`http://127.0.0.1:8000/api/categoryProviders/${categoryName}/`);
//       const { data } = await axios.get(`https://da7ye.pythonanywhere.com/api/categoryProviders/${categoryName}/`); //after deployement

  
//       dispatch({
//         type: PROVIDERS_LIST_SUCCESS,
//         payload: data
//       });
//     } catch(error) {
//       dispatch({
//         type: PROVIDERS_LIST_FAIL,
//         payload:
//           error.response && error.response.data.detail
//             ? error.response.data.detail
//             : error.message,
//       });
//     }
//   };
