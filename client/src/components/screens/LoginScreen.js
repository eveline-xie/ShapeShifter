import { useContext } from 'react';
import AuthContext from '../../auth'
import { GlobalStoreContext } from "../../store";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

// import { createTheme } from '@mui/material/styles';
// import { GlobalStoreContext } from '../store'

/*
    This React component lets users log in, which only
    happens when we are on the proper route.
    
*/

export default function LoginScreen() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  let exampleUser = { email: "email", username: "username", pass: "password" }

  const handleSignUp = () => {
    navigate('/signup')
  }

  const handleForgotPassword = () => {
    navigate('/forgotpassword')
  }

  const handleSubmit = (event) => {
    event.preventDefault();
     const userData = {
       username: username,
       password: password,
     };
     auth.login(userData);
    // store.resetStore();
  };

  return (
    <div>
      <div id="splash-screen">
        <div id="login-text">Log In</div>

        <Grid container component="main" sx={{ height: "100vh" }}>
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar> */}
          {/* <Typography align="center" display="flex">
                        Log in
                    </Typography> */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="email"
              autoComplete="email"
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="outlined"
              // color="secondary"
              focused
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
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                //     checked={cryon}
                //     onChange={this.handleChange('cryon')}
                //     style ={{
                //       color: "#00e676",
                //     }}
                />
              }
              label="Remember me"
              sx={{
                color: "white",
              }}
            />
            {errorMessage}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{
                backgroundColor: "rgba(255, 228, 132, .4)",
                borderRadius: 40,
                padding: "13px 34px",
                fontSize: "15px",
                color: "rgba(255, 228, 132, 1)",
              }}
            >
              Log In
            </Button>

            <Grid container justifyContent="space-between">
              <Grid item xs={4}>
                <Link  variant="body2" color="#ffffff"
                onClick={handleSignUp}>
                  Need an account? Sign up now!
                </Link>
              </Grid>
              <Grid item xs={8}>
                <Link variant="body2" color="#ffffff"
                onClick={handleForgotPassword}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>

            {/* <Copyright sx={{ mt: 5 }} /> */}
          </Box>
        </Grid>
      </div>
    </div>
  );
}