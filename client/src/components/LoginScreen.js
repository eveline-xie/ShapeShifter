import { useContext } from 'react';
// import AuthContext from '../auth'
// import Copyright from './Copyright'
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

export default function LoginScreen() {
  // const { auth } = useContext(AuthContext);
  // const { store } = useContext(GlobalStoreContext);

  const [emailUsername, setEmailUsername] = useState("");
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
    const formData = new FormData(event.currentTarget);
    if ((emailUsername !== exampleUser.email || emailUsername !== exampleUser.username) && password !== exampleUser.pass) {
      setErrorMessage(<div style={{color:'red'}}>Incorrect email/username or password!</div>);
      console.log("show error");
    }
    else {
      navigate("/home");
    }
    // auth.loginUser(
    //     formData.get('email'),
    //     formData.get('password')
    // );
    // store.resetStore();
  };

  // const theme = createTheme({
  //     palette: {
  //       primary: {
  //         main: '#FFE484',
  //       },
  //       secondary: {
  //         main: '#ffffff',
  //       },
  //     },
  //   });



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
              label="Email/Username"
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
              onChange={(e) => setEmailUsername(e.target.value)}
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