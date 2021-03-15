import { IEvent } from "../intefaces";
import { SAVE_EVENT, ERROR } from "../actions/event";
const initialState: IEvent = {
  name: "",
  dateCreated: "",
  error: false,
};

function eventState(state = initialState, action: any) {
  switch (action.type) {
    case SAVE_EVENT:
      return {
        ...state,
        name: action.name,

        dateCreated: action.createdAt,
      };
    case ERROR:
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
}
export default eventState;
