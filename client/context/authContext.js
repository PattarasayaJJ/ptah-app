import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Context
const AuthContext = createContext();

// Provider
const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: "",
  });

  // Initial local storage data
  useEffect(() => {
    const loadLocalStorageData = async () => {
      let data = await AsyncStorage.getItem("@auth");
      let signinData = JSON.parse(data);
      setState({ ...state, user: signinData?.user, token: signinData?.token });
    };
    loadLocalStorageData();
  }, []);

  // Update Axios settings when token changes
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = state.token
      ? `Bearer ${state.token}`
      : "";
  }, [state.token]);


   axios.defaults.baseURL = 'http://10.0.2.2:8080/api/v1';
 
  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
