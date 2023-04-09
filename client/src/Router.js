import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
// import { AuthContextProvider } from './auth';
// import { GlobalStoreContextProvider } from './store'
import {
  WelcomeScreen,
  LoginScreen,
  HomeScreen,
  NavBar,
  SignupScreen,
  CreateMap,
  EditMap
} from './components'
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
        {/* <AuthContextProvider>
                <GlobalStoreContextProvider>               */}
        {/* <AppBanner /> */}
        <NavBar />
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/createmap" element={<CreateMap />} />
          <Route path="/editmap" element={<EditMap />} />
        </Routes>
        {/* <Statusbar /> */}
        {/* </GlobalStoreContextProvider>
            </AuthContextProvider> */}
      </BrowserRouter>
    );
}

export default Router