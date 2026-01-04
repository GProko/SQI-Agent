import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';


const theme = createTheme({
  palette: {
    primary: {
      main: '#0056b3', 
    },
    background: {
      default: '#f4f7f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('intucate_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (email) => {
    localStorage.setItem('intucate_user', email);
    setUser(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('intucate_user');
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
    
      {user && (
        <AppBar position="static" color="inherit" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
              Intucate
            </Typography>
            <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
              {user}
            </Typography>
            <Button color="inherit" onClick={handleLogout} size="small">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}

  
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {user ? (
          <Dashboard />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;