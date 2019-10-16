import actionTypes from "../constants/actionTypes";
import initialState from "../store/initialState";

export default (state = initialState.channel, action) => {
  const switcher = {
    [actionTypes.SET_CURRENT_CHANNEL]: () => ({
      ...state,
      currentChannel: action.payload.currentChannel
    })
  };

  return switcher[action.type] ? switcher[action.type]() : state;
};
