import userReducer from "./userReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer
});

export { rootReducer as default };