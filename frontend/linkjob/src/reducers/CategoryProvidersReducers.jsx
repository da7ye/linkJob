import {
    PROVIDERS_LIST_REQUEST,
    PROVIDERS_LIST_SUCCESS,
    PROVIDERS_LIST_FAIL,
  } from "../constants/CategoryProvidersConstants";

export const categoryProvidersListReducers = (state={ workers: []}, action)=>{

    switch(action.type){
        case PROVIDERS_LIST_REQUEST:
            return {loading:true, workers: []};
        case PROVIDERS_LIST_SUCCESS:
            return {loading:false, workers: action.payload};
        case PROVIDERS_LIST_FAIL:
            return {loading:false, error: action.payload};

        default:
            return state;
    }
} 