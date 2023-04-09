import { useContext } from "react";
// import AuthContext from '../auth'

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
import { useState } from "react";

// import { createTheme } from '@mui/material/styles';
// import { GlobalStoreContext } from '../store'

export default function ResetPassword() {
  // const { auth } = useContext(AuthContext);
  // const { store } = useContext(GlobalStoreContext);
  const [input, setInput] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setInput(true);

    // const formData = new FormData(event.currentTarget);
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
        Password set. <a href="/login">Login</a> here!
      </div>
    );
  }

  return (
    <div>
      <div id="splash-screen">
        <div id="resetpassword-text">Reset your password here</div>
        {form}
      </div>
    </div>
  );
}
