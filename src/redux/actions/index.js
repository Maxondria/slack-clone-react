import actionTypes from "../constants/actionTypes";

export const setUser = currentUser => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser
    }
  };
};
