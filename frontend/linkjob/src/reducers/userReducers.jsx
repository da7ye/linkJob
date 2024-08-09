// //for provider

// import { USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS,USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_RESET    } from "../constants/userConstants";

// /* REDUCER USED IN UPDATING USER DETAILS IN ProfileScreen COMPONENT */


// export const userUpdateProfileReducer = (state = {}, action) => {
//     switch (action.type) {
//       case USER_UPDATE_PROFILE_REQUEST:
//         return {
//           loading: true,
//         };
  
//       case USER_UPDATE_PROFILE_SUCCESS:
//         return {
//           loading: false,
//           success: true,
//           user: action.payload,
//         };
  
//       case USER_UPDATE_PROFILE_FAIL:
//         return {
//           loading: false,
//           error: action.payload,
//         };
  
//       case USER_UPDATE_PROFILE_RESET:
//         return {}; /* RESET STATE */
  
//       default:
//         return state;
//     }
//   };