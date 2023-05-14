import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NavbarWebsite() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ 'background': '#F2BC07', 'color':'#0C0E12'}}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div" > DEALCHAIN </Typography>
          <Button variant="contained" href="/app" align="right" style={{ 'background': '#0C0E12', 'color': '#F2BC07' }}>Launch APP</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}