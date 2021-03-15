export const SAVE_EVENT = "SAVE_EVENT";
export const ERROR = "ERROR";
import { axiosInstance } from "../../services/network_request";

export const saveEvent = (name: string) => {
  return async (dispatch: any) => {
    try {
      const newEvent = (
        await axiosInstance.post("/event/createevent", { name: name })
      ).data;
      dispatch({
        type: SAVE_EVENT,
        name: newEvent.event,
        dateCreated: newEvent.createdAt,
      });
    } catch (e) {
      dispatch({
        Ttype: ERROR,
        error: true,
      });
    }
  };
};
