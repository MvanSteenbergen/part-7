import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    style: "",
    message: null,
  },
  reducers: {
    setSuccess(state, action) {
      state = {
        style: "success",
        message: action.payload,
      };
      return state;
    },
    setFailure(state, action) {
      state = {
        style: "error",
        message: action.payload,
      };
      return state;
    },
    resetNotification(state, action) {
      state = {
        style: "",
        message: null,
      };
      return state;
    },
  },
});

export const { setSuccess, setFailure, resetNotification } =
  notificationSlice.actions;

export const displaySuccess = (message) => {
  console.log(message);
  return (dispatch) => {
    dispatch(setSuccess(message));
    setTimeout(() => dispatch(resetNotification()), 5000);
  };
};

export const displayFailure = (message) => {
  return (dispatch) => {
    dispatch(setFailure(message));
    setTimeout(() => dispatch(resetNotification()), 5000);
  };
};

export default notificationSlice.reducer;
