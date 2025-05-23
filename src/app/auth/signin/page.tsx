'use client';

import { Box, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import LoginForm from '@/components/login/LoginForm';
import AnimatedTooth from '@/components/anime/tooth'; 

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,rgb(126, 148, 233) 0%,rgb(201, 190, 212) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={4} 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            minHeight: isMobile ? 'auto' : '80vh',
          }}
        >
          {/* Logo animado */}
          <Grid 
            item 
            xs={20} 
            md={6} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              order: isMobile ? 1 : 0,
            }}
          >
            <Box
              sx={{
                transform: isMobile ? 'scale(1)' : 'scale(1.3)',
                transition: 'transform 0.3s ease',
              }}
            >
              <AnimatedTooth />
            </Box>
          </Grid>

          {/* Formulario de login */}
          <Grid 
            item 
            xs={12} 
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              order: isMobile ? 2 : 1,
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 450 }}>
              <LoginForm />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}