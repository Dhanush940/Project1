import { createReducer } from "@reduxjs/toolkit";

//IMP Refer reduxtoolkit doc. It is mentioned that we either mutate the state (by changing the contents of the object or array) or return a new state. Where as in the case of initialState=1 , we are not exactly mutating the state but rather chainging the reference value of the state which is not accepted so returned a new state
// const initialState = {
//   isAuthenticated: false,
//   //   user: {},
//   //   loading: false,
//   // appa: "asdfasd",
// };
// const initialState = 1;

//Experimenting with redux/immer
// export const userReducer = createReducer(initialState, {
//     LoadUserRequest: (state, action) => {
//       state.loading = "asdfasdf";
//       state.isAuthenticated = "asdfasdfasf";
//       state.user = action.payload;
//       console.log("State isAuthenticated ", state.isAuthenticated);
//       console.log("State loading ", state.loading);
//       console.log("State user ", state.user);
//       // console.log("State error ", state.error);
//     },
//     LoadUserSuccess: (state, action) => {
//       console.log("State2 isAuthenticated ", state.isAuthenticated);
//       console.log("State2 loading ", state.loading);
//       console.log("State2 user ", state.user);
//       // console.log("State error ", state.error);
//       // console.log(action.payload);
//     },
//     LoadUserFail: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//       state.isAuthenticated = false;
//     },

//   LoadUserRequest: (state) => {
//     // state.adf=1
//     console.log("Initial State is", state.toString());
//     console.log(state.valueOf());
//     console.log(state.toLocaleString());
//     console.log(state.valueOf());
//     state = 2;
//     console.log(" State Request is", state.toString());
//     return state;
//   },
//   //If like lets say the state is a number and you are actually try to assign like an object like below then LoadUserFail will be called directly
//   LoadUserSuccess: (state, action) => {
//     state.isAuthenticated = true;
//     state.loading = false;
//     state.user = action.payload;
//     // state.minor = "minor";
//   },
//   LoadUserFail: (state, action) => {
//     // state.loading = false;
//     // state.error = action.payload;
//     // state.isAuthenticated = false;
//     state = 4;
//     console.log(" State Error is", state.toString());
//     return state;
//   },

//If there are multiple same action types like lets say you have two LoadUserRequest in the reducer then the latest one will be executed
// });

const initialState = {
  isAuthenticated: false,
};

export const userReducer = createReducer(initialState, {
  LoadUserRequest: (state) => {
    state.loading = true;
  },
  LoadUserSuccess: (state, action) => {
    state.isAuthenticated = true;
    state.loading = false;
    state.user = action.payload;
  },
  LoadUserFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticated = false;
  },

  // update user information
  updateUserInfoRequest: (state) => {
    state.loading = true;
  },
  updateUserInfoSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
  },
  updateUserInfoFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },

  // update user address
  updateUserAddressRequest: (state) => {
    state.addressloading = true;
  },
  updateUserAddressSuccess: (state, action) => {
    state.addressloading = false;
    state.successMessage = action.payload.successMessage;
    state.user = action.payload.user;
  },
  updateUserAddressFailed: (state, action) => {
    state.addressloading = false;
    state.error = action.payload;
  },

  // delete user address
  deleteUserAddressRequest: (state) => {
    state.addressloading = true;
  },
  deleteUserAddressSuccess: (state, action) => {
    state.addressloading = false;
    state.successMessage = action.payload.successMessage;
    state.user = action.payload.user;
  },
  deleteUserAddressFailed: (state, action) => {
    state.addressloading = false;
    state.error = action.payload;
  },

  // get all users --- admin
  getAllUsersRequest: (state) => {
    state.usersLoading = true;
  },
  getAllUsersSuccess: (state, action) => {
    state.usersLoading = false;
    state.users = action.payload;
  },
  getAllUsersFailed: (state, action) => {
    state.usersLoading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
  clearMessages: (state) => {
    state.successMessage = null;
  },
});
