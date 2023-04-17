import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth";
// import { createTheme } from '@mui/material/styles';
// import { GlobalStoreContext } from '../store'

/*
    This React component lets users reset their password, which only
    happens when the user clicks on the link from their email.
    
*/

export default function ResetPassword(props) {
  const { auth } = useContext(AuthContext);
  // const { store } = useContext(GlobalStoreContext);
  const [input, setInput] = useState(false);
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSubmit = (event) => {
    setErrorMessage("");
    console.log(props.email + " reset email");
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    if (password == "" || verifiedPassword == "") {
      setErrorMessage(<div style={{ color: "red" }}>Fill Out Everything!</div>);
    } else if (password !== verifiedPassword) {
      setErrorMessage(
        <div style={{ color: "red" }}>Passwords Not Matching!</div>
      );
    }

    console.log("username for recover password: " + auth.user.username);
    const userData = {
      username: auth.user.username,
      password: password,
    };
    auth.updatePassword(userData);
    if (!auth.error) {
      setInput(true);
    }

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

  let form = (
    <Grid container component="main" rowSpacing={4}>
      <Grid item xs={12}>
        <TextField
          // margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
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
          Submit
        </Button>
      </Grid>
    </Grid>
  );

  if (input) {
    form = (
      <div id="emailsent-text">
        Password set.
        <a onClick={handleLogin}>
          {" "}
          <u> Login</u>
        </a>{" "}
        here!
      </div>
    );
  }

  return (
    <div>
      <div id="splash-screen">
        <div id="resetpassword-text">Reset your password here</div>
        {form}
        {errorMessage}
      </div>
    </div>
  );
}
