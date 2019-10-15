import actionTypes from "../constants/actionTypes";
import initialState from "../store/initialState";

export default (state = initialState.user, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    default:
      return state;
  }
};
