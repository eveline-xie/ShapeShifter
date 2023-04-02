import React, {useState} from 'react';
import axios from "axios";

const api = axios.create({
  baseURL: 'https://shapeshifter-api.onrender.com'
   //baseURL: "http://10.245.200.126:3000"
})
export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupMsg, setSignupMsg] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  const onSignup = async () => { 
    await api.post("/auth/signup", {firstName: firstName, lastName: lastName, username: username, email:email, password: password})
    .then(function (res) {
      console.log(res);
      if(res.data.error){
        setSignupMsg("Sign up error")
      }else{
        setSignupMsg("Sign up success")
      }
    });
  }
  const onLogin = async () => { 
    await api.post("/auth/login", {email:loginEmail, password: loginPassword})
    .then(function (res) {
      console.log(res);
      if(res.data.error){
        setLoginMsg("login error")
      }else{
        setLoginMsg("login success")
      }
    });;
  }

  return (
    <div>
      
      <p>Sign Up!</p>
      <form>
            <div>
                <label>First Name:</label>
                <input type="text" id="sign-up-firstname" value = {firstName} onChange = {(e) => setFirstName(e.target.value)}/>
            </div>
            <div>
                <label>Last Name:</label>
                <input type="text" id="sign-up-lastname" value = {lastName} onChange = {(e) => setLastName(e.target.value)} />
            </div>
            <div>
                <label>Username:</label>
                <input type="text" id="sign-up-username" value = {username} onChange = {(e) => setUsername(e.target.value)}/>
            </div>
            <div>
                <label>Email:</label>
                <input type="text" id="sign-up-email" value = {email} onChange = {(e) => setEmail(e.target.value)}/>
            </div>
            <div>
                <label>Password:</label>
                <input type="text" id="sign-up-password" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
            </div>
            <input type="button" id="sign-up-submit" value="Signup" onClick={onSignup}/>
            {signupMsg}
     </form>

        <p>Login!</p>
        <form>
            <div>
                <label>Email:</label>
                <input type="text" id="login-email" value = {loginEmail} onChange = {(e) => setLoginEmail(e.target.value)}/>
            </div>
            <div>
                <label>Password:</label>
                <input type="text" id="login-password" value = {loginPassword} onChange = {(e) => setLoginPassword(e.target.value)}/>
            </div>
            <input type="button" id="sign-up-submit" value="Login" onClick={onLogin}/>
            {loginMsg}
      </form>
            
    </div>
  )
}