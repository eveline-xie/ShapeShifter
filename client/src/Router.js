import "./App.css";
import { React } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
  HomeWrapper,
  WelcomeScreen,
  LoginScreen,
  HomeScreen,
  NavBar,
  SignupScreen,
  ForgotPassword,
  ResetPassword,
  CommunityScreen,
  CreateMap,
  EditMap,
  CommunityGuestScreen,
  SharedScreen
} from "./components";
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const Router = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            {/* <Route path="/welcome" element={<WelcomeScreen />} /> */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/createmap" element={<CreateMap />} />
            <Route path="/editmap" element={<EditMap />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/community" element={<CommunityScreen />} />
            <Route path="/communityguest" element={<CommunityGuestScreen />} />
            <Route path="/shared" element={<SharedScreen />} />
          </Routes>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default Router;
