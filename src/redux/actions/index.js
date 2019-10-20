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

export const setPrivateChannel = isPrivateChannel => ({
  type: actionTypes.SET_PRIVATE_CHANNEL,
  payload: {
    isPrivateChannel
  }
});

export const setUserPosts = userPosts => ({
  type: actionTypes.SET_USER_POSTS,
  payload: {
    userPosts
  }
});
