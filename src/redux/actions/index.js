import actionTypes from "../constants/actionTypes";

export const setUser = currentUser => ({
  type: actionTypes.SET_USER,
  payload: {
    currentUser
  }
});

export const clearUser = () => ({
  type: actionTypes.CLEAR_USER
});

export const setCurrentChannel = currentChannel => ({
  type: actionTypes.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel
  }
});
