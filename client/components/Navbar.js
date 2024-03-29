import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ConnectButton from './ConnectButton';
import Link from 'next/link'

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" style={{ 'background': '#F2BC07', 'color':'#0C0E12'}}>
        <Toolbar>
            <Typography variant="h6" component="div" > 
              <Link href='/app/'> DEALCHAIN </Link>
            </Typography>
            <Typography variant="h6" sx={{ paddingLeft: 8, paddingRight: 3}}> 
              <Link href='/app/create'> Create Product </Link>
            </Typography>
            <Typography variant="h6" sx={{flexGrow: 1, padding: 3}}>
              <Link href='/app/propose'> Propose Product </Link>
            </Typography>
            <ConnectButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}