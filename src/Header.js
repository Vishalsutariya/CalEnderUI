// src/Header.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, IconButton } from '@mui/material';
import { AuthContext } from './AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const { user } = useContext(AuthContext);

  const handleLogin = () => {
    window.open('http://localhost:5001/auth/google', '_self');
  };

  const handleLogout = () => {
    window.open('http://localhost:5001/auth/logout', '_self');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Optionally add a menu icon for mobile */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', sm: 'none' }, mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CalEnder
        </Typography>
        {user ? (
          <>
            <Typography
              variant="body1"
              sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
            >
              {user.displayName}
            </Typography>
            <Avatar src={user.photo} alt={user.displayName} sx={{ mr: 2 }} />
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={handleLogin}>
            Login with Google
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
