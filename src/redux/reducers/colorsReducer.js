import actionTypes from "../constants/actionTypes";
import initialState from "../store/initialState";

export default (state = initialState.colors, action) => {
  const switcher = {
    [actionTypes.SET_COLORS]: () => ({
      ...state,
      ...action.payload
    })
  };

  return switcher[action.type] ? switcher[action.type]() : state;
};
