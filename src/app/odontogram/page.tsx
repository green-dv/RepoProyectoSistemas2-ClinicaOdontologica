'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Paper } from '@mui/material';
import OdontogramaGrid from '@/components/odontogram/OdontogramGrid';
import { Suspense } from 'react';

const theme = createTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    h4: { fontWeight: 600, marginBottom: '2rem' },
  },
});

export default function OdontogramaPage() {
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" color="primary" gutterBottom sx={{ '@media print': { display: 'none' } }}>
            🦷 Odontograma Digital
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          <Suspense fallback={<div>Cargando...</div>}>
            <OdontogramaGrid
            />
          </Suspense>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
