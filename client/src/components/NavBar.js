import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from "react";
import AuthContext from "../auth";

/*
   This navbar is a functional React component that
    manages the login, signup, home, community, and profile buttons that stay at the top of the UI.
*/
const pages = ["Login", "Join"];
const settings = ['Logout'];

function NavBar() {
  const { auth } = useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (auth.user) {setFirstName(auth.user.firstName);
      setLastName(auth.user.lastName);}
    if (auth.error) {
      setErrorMessage(auth.errMessage);
    }
  });
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSwitchPage = (event, page) => {
    console.log(window.location.pathname);
    if (page == "Login") {
      auth.noError();
      navigate('/login');
    }
    else if (page == "Join") {
      auth.noError();
      navigate('/signup');
    }
    else if (page == "SplashorHome") {
      if (auth.loggedIn) {
        auth.noError();
        navigate('/home');
      }
      else {
        navigate('');
      }
    }
    else if (page == "Community") {
      auth.noError();
      navigate('/community');
    }
    else if (page == "Home") {
      auth.noError();
      navigate('/home');
    }
  }

  const handleLogout = () =>{
    handleCloseUserMenu();
    auth.logoutUser();
    auth.noError();
    navigate("/");
  }

  let buttons =
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={(event) => handleSwitchPage(event, page)}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          {page}
        </Button>
      ))}
    </Box>

  let pfp = ''

  // maybe include community page
  // let notLoggedInPaths = ['/', '/login', '/signup', '/forgotpassword', '/communityguest']
  // if (!notLoggedInPaths.includes(window.location.pathname)) {
  if (auth.loggedIn) {
    buttons = '';
    pfp = <div>
    <Box sx={{ flexGrow: 0 }} >
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar sx={{ bgcolor: "#9660BF" }}>{firstName[0]}{lastName[0]}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={handleLogout}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  </div>;
  }

  let homeCommunity = ""
  if (window.location.pathname == "/home" || window.location.pathname == "/shared") {
    homeCommunity =
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Button
          key={"Community"}
          onClick={(event) => handleSwitchPage(event, "Community")}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          Community
        </Button>
    </Box>
  }
  else if (window.location.pathname == "/community") {
    homeCommunity =
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Button
          key={"Home"}
          onClick={(event) => handleSwitchPage(event, "Home")}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          Home
        </Button>
    </Box>
  }

  return (
    <AppBar position="static" style={{ background: '#145374' }}>
      <Container maxWidth="xl">
        <Box display="flex" alignItems="center" p={2}>
          <div style={{ width: '15%' }}>
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
              onClick={(event) => handleSwitchPage(event, "SplashorHome")}
            >
              <img src='logo.png' width="150px" height="64.5px" />
            </Typography>
          </div>
          <div style={{ flexGrow: 1, textAlign: 'right' }}>{buttons}</div>
          {homeCommunity}
          {pfp}
        </Box>
      </Container>
    </AppBar>
  );
}
export default NavBar;