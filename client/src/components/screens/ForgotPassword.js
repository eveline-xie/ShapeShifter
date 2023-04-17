import { useContext } from "react";
import AuthContext from "../../auth";
import { useState } from "react";
// import Copyright from './Copyright'
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Lock from "@mui/icons-material/Lock";
import Email from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";
// import { createTheme } from '@mui/material/styles';
// import { GlobalStoreContext } from '../store'

/*
    This React component lets users input their email to recover their password, which only happens when we are on the proper route.
    
*/
export default function ForgotPassword() {
  const { auth } = useContext(AuthContext);
  // const { store } = useContext(GlobalStoreContext);
  const [input, setInput] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();
  let exampleEmail = "email";

  const handleSubmit = (event) => {
    setErrorMessage("");
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    if (email == "") {
      setErrorMessage(<div style={{ color: "red" }}>Provide an Email!</div>);
    }
    // else if (email !== exampleEmail) {
    //   setErrorMessage(<div style={{ color: 'red' }}>We Couldn't Find Your Email :(</div>);
    // }
    // else {
    //   setInput(true);
    // }
    const userData = email;
    auth.forgotPassword(userData);
    setInput(true);
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
  function handleReset() {
    navigate("/resetpassword");
  }

  async function handleSubmitCode() {
    console.log("code submitted: " + code);
    auth.verifycode(email, code);
    navigate("/resetpassword");

    // if (auth.user) {
    //   navigate("/resetpassword");
    // } else {
    //   setErrorMessage(<div style={{ color: "red" }}>Invalid code!</div>);
    // }
  }

  let title = (
    <div>
      <div id="forgotpassword-text">Forgot Password?</div>

      <div id="forgotpassword-subtext">
        Don’t worry, happens to the best of us :)
      </div>
    </div>
  );
  let form = (
    <Grid container component="main" rowSpacing={4}>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          // autoComplete="email"
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
          Email me a recovery link
        </Button>
      </Grid>
    </Grid>
  );

  let codeform = (
    <Grid container component="main" rowSpacing={4}>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="code"
          label="Verificiation Code"
          name="code"
          //  autoComplete="email"
          autoFocus
          variant="outlined"
          InputLabelProps={{
            style: { color: "#ffffff" },
          }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
          onClick={handleSubmitCode}
        >
          Submit Code
        </Button>
      </Grid>
    </Grid>
  );

  if (input) {
    form =
      // <div id="emailsent-text">
      //   <a onClick={handleReset}>Email sent! Check your mailbox :)</a>
      // </div>
      codeform;
    title = (
      <div>
        <div id="forgotpassword-text">Enter Verificaiton Code</div>

        <div id="forgotpassword-subtext">Check your email :)</div>
      </div>
    );
  }

  return (
    <div id="splash-screen">
      {title}
      {form}
      {errorMessage}
    </div>
  );
}
