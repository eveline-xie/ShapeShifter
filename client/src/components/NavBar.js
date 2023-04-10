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

const pages = ["Login", "Join"];
const settings = ['Logout'];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();

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
      navigate('/login');
    }
    else if (page == "Join") {
      navigate('/signup');
    }
    else if (page == "Splash") {
      navigate('');
    }
    else if (page == "Community") {
      navigate('/community');
    }
    else if (page == "Home") {
      navigate('/home');
    }
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
  let notLoggedInPaths = ['/', '/login', '/signup']
  if (!notLoggedInPaths.includes(window.location.pathname)) {
    buttons = '';
    pfp = <div>
    <Box sx={{ flexGrow: 0 }} >
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
          <MenuItem key={setting} onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  </div>;
  }

  let homeCommunity = ""
  if (window.location.pathname == "/home") {
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
              onClick={(event) => handleSwitchPage(event, "Splash")}
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