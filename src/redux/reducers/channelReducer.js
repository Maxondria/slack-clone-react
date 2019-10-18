import actionTypes from "../constants/actionTypes";
import initialState from "../store/initialState";

export default (state = initialState.channel, action) => {
  const switcher = {
    [actionTypes.SET_CURRENT_CHANNEL]: () => ({
      ...state,
      currentChannel: action.payload.currentChannel
    }),

    [actionTypes.SET_PRIVATE_CHANNEL]: () => ({
      ...state,
      isPrivateChannel: action.payload.isPrivateChannel
    })
  };

  return switcher[action.type] ? switcher[action.type]() : state;
};
