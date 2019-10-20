import userReducer from "./userReducer";
import channelReducer from "./channelReducer";
import colorsReducer from "./colorsReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
  colors: colorsReducer
});

export { rootReducer as default };
