import { useContext, useEffect} from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock'
import Email from '@mui/icons-material/Email'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import AuthContext  from "../../auth";
import { GlobalStoreContext } from "../../store";


/*
    This React component lets user sign up, which only
    happens when we are on the proper route.  
*/

export default function SignupScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verifiedPassword, setVerifiedPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    let navigate = useNavigate();
    useEffect(() => {
      if (auth.error) {
      setErrorMessage(auth.errMessage);  
      }
    });
    let exampleUser = { email: "email", username: "username", password: "password", verifiedPassword: "password" }

    const handleLogin = () => {
      auth.noError();
      navigate('/login');
    }

    const handleSubmit = async(event) => {
      event.preventDefault();
      if (
        email == "" ||
        username == "" ||
        password == "" ||
        verifiedPassword == ""
      ) {
        setErrorMessage("Fill Out Everything!");
        return;
      }
      if(!isEmail(email)){
        setErrorMessage(`${email} is not a valid email address.`);
        return;
      }
      const userData = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        passwordVerify: verifiedPassword,
      };
      auth.signup(userData);
      // setErrorMessage(auth.errMessage);
      // store.resetStore();
    };
    function isEmail(email) {
      return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }
    return (
      <div>
        <div id="splash-screen">
          <div id="signup-text">Sign Up</div>

          <div id="login-link">
            <Link onClick={handleLogin} variant="body2" color="#ffffff">
              Already have an account? Login here!
            </Link>
          </div>

          <Grid container component="main" rowSpacing={2} spacing={4}>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstname"
                label="First Name"
                name="firstname"
                autoComplete="firstname"
                autoFocus
                variant="outlined"
                // color="primary"
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="lastname"
                autoFocus
                variant="outlined"
                // color="primary"
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                // color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                // margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                variant="outlined"
                // color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                // margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                autoComplete="current-password"
                autoFocus
                variant="outlined"
                type="password"
                // color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                // margin="normal"
                required
                fullWidth
                id="verified-password"
                label="Password Verify"
                name="verified-password"
                autoComplete="current-password"
                type="password"
                autoFocus
                variant="outlined"
                // color="primary"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#ffffff" },
                }}
                onChange={(e) => setVerifiedPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <div style={{ color: "red" }}>{errorMessage}</div>
              <Button
                type="submit"
                size="medium"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{
                  backgroundColor: "rgba(255, 228, 132, .4)",
                  borderRadius: 40,
                  padding: "13px 34px",
                  fontSize: "15px",
                  color: "rgba(255, 228, 132, 1)",
                }}
                onClick={handleSubmit}
              >
                Create an Account
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
}