import React, { createContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import api from "../api";

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  SIGNUP: "SIGNUP",
  LOGIN: "LOGIN",
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGOUT: "LOGOUT",
  ERROR: "ERROR",
  GUEST_LOGGED_IN: "GUEST_LOGGED_IN",
  NO_ERROR: "NO_ERROR",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  VERIFY_CODE: "VERIFY_CODE",
  UPDATE_PASSWORD: "UPDATE_PASSWORD",
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    error: false,
    errMessage: null,
    guest: false,
  });
//   const history = useHistory();

  useEffect(() => {
    auth.getLoggedIn();
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          error: false,
          errMessage: null,
          guest: false,
        });
      }
      case AuthActionType.SIGNUP: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          error: false,
          errMessage: null,
          guest: false,
        });
      }
      case AuthActionType.LOGOUT: {
        return setAuth({
          user: null,
          loggedIn: false,
          error: false,
          errMessage: null,
          guest: false,
        });
      }
      case AuthActionType.LOGIN: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          error: false,
          errMessage: null,
          guest: false,
        });
      }
      case AuthActionType.ERROR: {
        return setAuth({
          user: auth.user,
          loggedIn: auth.loggedIn,
          error: true,
          errMessage: payload.errMessage,
          guest: false,
        });
      }
      case AuthActionType.NO_ERROR: {
        return setAuth({
          user: auth.user,
          loggedIn: auth.loggedIn,
          error: false,
          errMessage: null,
          guest: false,
        });
      }
      case AuthActionType.GUEST_LOGGED_IN: {
        return setAuth({
          user: null,
          loggedIn: false,
          error: false,
          errMessage: null,
          guest: true,
        });
      }
      case AuthActionType.FORGOT_PASSWORD: {
        return setAuth({
          user: null,
          loggedIn: false,
          error: false,
          errMessage: null,
          guest: false,
        });
      }
      case AuthActionType.UPDATE_PASSWORD: {
        return setAuth({
          user: null,
          loggedIn: false,
          error: false,
          errMessage: null,
          guest: false,
        });
      }
      case AuthActionType.VERIFY_CODE: {
        return setAuth({
          user: payload.user,
          loggedIn: false,
          error: false,
          errMessage: null,
          guest: false,
        });
      }
      default:
        return auth;
    }
  };
  auth.guestLogin = async function () {
    console.log("guest log on");
    authReducer({
      type: AuthActionType.GUEST_LOGGED_IN,
    });
  };

  auth.logoutUser = async function () {
    const response = await api.logout();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT,
      });
    }
  };

  auth.getLoggedIn = async function () {
    const response = await api.getLoggedIn();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.GET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user,
        },
      });
    }
  };

  auth.signup = async function (userData) { 
    try {
      const response = await api.signup(userData);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.SIGNUP,
          payload: {
            user: response.data.user,
          },
        });
        console.log("user: " + response.data.user);
        // history.push("/");
        
      }
    } catch (err) {
      console.log(err);
      authReducer({
        type: AuthActionType.ERROR,
        error: true,
        payload: {
          errMessage: err.response.data.errorMessage,
        },
      });
    }
  };

  auth.login = async function (userData) {
    //add store to param
    try {
      const response = await api.login(userData);
      console.log(response.data.user + " log in");
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGIN,
          payload: {
            user: response.data.user,
          },
        });
        console.log("user logged in: " + response.data.user.firstName);
        // history.push("/");
        //load map
      }
    } catch (err) {
      console.log(err.response.data.errorMessage);
      authReducer({
        type: AuthActionType.ERROR,
        error: true,
        payload: {
          errMessage: err.response.data.errorMessage,
        },
      });
    }
  };

    auth.forgotPassword = async function (userData) {
      try {
        const response = await api.forgotPassword(userData);
        if (response.status === 200) {
          authReducer({
            type: AuthActionType.FORGOT_PASSWORD,
          });
          // history.push("/");
        }
      } catch (err) {
        console.log(err);
        authReducer({
          type: AuthActionType.ERROR,
          error: true,
          payload: {
            errMessage: err.response.data.errorMessage,
          },
        });
      }
    };

    auth.updatePassword = async function (userData) {
      try {
        const response = await api.updatePassword(userData);
        if (response.status === 200) {
          authReducer({
            type: AuthActionType.UPDATE_PASSWORD,
          });
          // history.push("/");
        }
      } catch (err) {
        console.log(err);
        authReducer({
          type: AuthActionType.ERROR,
          error: true,
          payload: {
            errMessage: err.response.data.errorMessage,
          },
        });
      }
    };

auth.verifycode = async function (email, code) {
  //add store to param
  try {
    const response = await api.verifyPassword(email, code);
    console.log(response.data.user + " verify code");
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.VERIFY_CODE,
        payload: {
          user: response.data.user,
        },
      });
      console.log("user verified: " + response.data.user.firstName);
      // history.push("/");
      //load map
    }
  } catch (err) {
    console.log(err.response.data.errorMessage);
    authReducer({
      type: AuthActionType.ERROR,
      error: true,
      payload: {
        errMessage: err.response.data.errorMessage,
      },
    });
  }
};
  // auth.error = async function () {
  //   authReducer({
  //     type: AuthActionType.ERROR,
  //     error: true,
  //     payload: {
  //       errMessage: "Duplicate list name or item,  or empty item",
  //     },
  //   });
  // };

  auth.noError = async function () {
    console.log("no error");
    authReducer({
      type: AuthActionType.NO_ERROR,
      error: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };