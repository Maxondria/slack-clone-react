import userReducer from "./userReducer";
import channelReducer from "./channelReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer
});

export { rootReducer as default };
