import React, { useState } from 'react';
import axios from "axios";

const api = axios.create({
  // baseURL: 'https://shapeshifter-api.onrender.com'
  baseURL: "http://localhost:5000"
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

  const [rememberPassUsername, setRememberPassUsername] = useState("");
  const [rememberPassEmail, setRememberPassEmail] = useState("");
  const [rememberPass, setRememberPass] = useState("");

  const [changePassUsername, setChangePassUsername] = useState("");
  const [changePassPassword, setChangePassPassword] = useState("");
  const [changePassNewPassword, setChangePassNewPassword] = useState("");
  const [changePass, setChangePass] = useState("");

  const onSignup = async () => {
    await api.post("/auth/signup", { firstName: firstName, lastName: lastName, username: username, email: email, password: password })
      .then(function (res) {
        console.log(res);
        if (res.data.error) {
          setSignupMsg(res.data.message)
        } else {
          setSignupMsg("Sign up success")
        }
      });
  }
  const onLogin = async () => {
    await api.post("/auth/login", { email: loginEmail, password: loginPassword })
      .then(function (res) {
        console.log(res);
        if (res.data.error) {
          setLoginMsg("login error")
        } else {
          setLoginMsg("login success")
        }
      });
  }

  const onRememberPassword = async () => {
    console.log(rememberPassEmail);
    console.log(rememberPassUsername);
    await api.get(`/auth/remember-password?email=${rememberPassEmail}&username=${rememberPassUsername}`)
    .then(function (res) {
      console.log(res);
      if (res.data.error) {
        setRememberPass("remember password error")
      } else {
        setRememberPass("pass: " + res.data.password)
      }
    });
  }

  const onChangePassword = async () => {
    console.log(changePassUsername);
    console.log(changePassPassword);
    console.log(changePassNewPassword);
    await api.put("/auth/change-password", 
    { username: changePassUsername, password: changePassPassword, newPassword: changePassNewPassword })
    .then(function (res) {
      console.log(res);
      if (res.data.error) {
        setChangePass("change password error")
      } else {
        setChangePass("Password Changed!")
      }
    });
  }

  return (
    <div>
      <p>Sign Up!</p>
      <div>
        <label>First Name:</label>
        <input type="text" id="sign-up-firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" id="sign-up-lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div>
        <label>Userame:</label>
        <input type="text" id="sign-up-username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="text" id="sign-up-email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="text" id="sign-up-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <input type="button" id="sign-up-submit" value="Signup" onClick={onSignup} />
      {signupMsg}


      <p>Login!</p>
      <div>
        <label>Email:</label>
        <input type="text" id="login-email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="text" id="login-password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
      </div>
      <input type="button" id="log-in-submit" value="Login" onClick={onLogin} />
      {loginMsg}

      <p>Forgot Password?</p>
      <div>
        <label>Email:</label>
        <input type="text" id="remember-email" value={rememberPassEmail} onChange={(e) => setRememberPassEmail(e.target.value)} />
      </div>
      <div>
        <label>Username:</label>
        <input type="text" id="remember-username" value={rememberPassUsername} onChange={(e) => setRememberPassUsername(e.target.value)} />
      </div>
      <input type="button" id="remember-pass-submit" value="Remember Password" onClick={onRememberPassword} />
      {rememberPass}

      <p>Change Password</p>
      <div>
        <label>Username:</label>
        <input type="text" id="change-username" value={changePassUsername} onChange={(e) => setChangePassUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="text" id="change-password" value={changePassPassword} onChange={(e) => setChangePassPassword(e.target.value)} />
      </div>
      <div>
        <label>New Password:</label>
        <input type="text" id="change-new-password" value={changePassNewPassword} onChange={(e) => setChangePassNewPassword(e.target.value)} />
      </div>
      <input type="button" id="change-pass-submit" value="Change Password" onClick={onChangePassword} />
      {changePass}

    </div>
  )
}