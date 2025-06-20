'use client';

import { useSearchParams } from 'next/navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Paper } from '@mui/material';
import OdontogramaGrid from '@/components/odontogram/OdontogramGrid';

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
  const searchParams = useSearchParams();
  const idpaciente = parseInt(searchParams.get('idpaciente') ?? '0');
  const idconsultaParam = searchParams.get('idconsulta');
  const creating = searchParams.get('creating') === 'true';

  const idconsulta = idconsultaParam ? parseInt(idconsultaParam) : null;

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
          <OdontogramaGrid
            creating={creating}
            idpaciente={idpaciente}
            idconsulta={idconsulta}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
