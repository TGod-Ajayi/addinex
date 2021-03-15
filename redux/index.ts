import { combineReducers } from "redux";
import eventReducer from "../redux/reducers/event";

const rootReducer = combineReducers({
  events: eventReducer,
});
export default rootReducer;
