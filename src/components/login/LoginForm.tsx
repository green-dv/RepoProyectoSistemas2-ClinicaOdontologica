"use client";
import { useEffect } from 'react';
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from "next-auth/react";
//ver contraseña
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
//cambiar icono guardado
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

//google y facebbook
import Tooltip from '@mui/material/Tooltip';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';

import {
    Box, 
    TextField, 
    Typography, 
    Button,
    Container, 
    Paper,
    Avatar, 
    FormControlLabel, 
    Checkbox,
    Grid,
    Link as MuiLink,
    Alert
} from '@mui/material';

import { Oswald } from 'next/font/google';

const oswald = Oswald({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
});

//============================================================================
// ESTOS SON COMPONENTES DEL MATERIAL UI SI SE PUEDE AGRGAR ESTILOS ESTARIA BIEN
//============================================================================

export function LoginForm() {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);


    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const { status } = useSession();
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);
    
    const searchParams = useSearchParams();
    if(searchParams.get('error') === 'usernotfound'){
        setError("Usuario no encontrado")
    }
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'usernotfound') {
          setError("Usuario no encontrado");
        }
      }, [searchParams]);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Correo o contraseña incorrectos");
                return;
            }

            router.push('/');   
        } catch (err) {
            setError("Ocurrió un error durante el inicio de sesión");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={10}
                sx={{
                    marginTop: 8,
                    padding: 3, // Aumenté el padding para más espacio dentro del formulario
                    borderRadius: '12px', // Borde redondeado
                    background: 'linear-gradient(45deg,rgb(230, 255, 255) 30%,rgb(73, 182, 255) 90%)', // Fondo de gradiente
                }}>
                
                <Avatar
                    alt="Remy Sharp"
                    src="https://png.pngtree.com/png-clipart/20200720/original/pngtree-abstract-tooth-dental-logo-png-image_4355278.jpg"
                    sx={{ width: 60, height: 60, mx: "auto",
                        textAlign: "center",
                        mb: 1,}}
                />
                <Typography component="h1" variant="h5" className={oswald.className}
                sx={{
                    textAlign: 'center',
                    textTransform: 'uppercase', 
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    color: '#fff',
                    mb: 2,
                    textShadow: '1px 1px 1px rgba(0,0,0,0.2)'
                }}>
                    Iniciar Sesión
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField 
                        id="standard-basic" 
                        variant="standard" 
                        fullWidth 
                        label="Correo Electrónico" 
                        margin="normal" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Contraseña"
                        variant="standard"
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                    sx={{ mb: 2 }}
                    />

                    <FormControlLabel
                        control={<Checkbox 
                            value='remember' 
                            color='primary' 
                            icon={<BookmarkBorderIcon 
                            />}
                        checkedIcon={<BookmarkIcon />}/>}
                        label={
                    <Typography sx={{ fontWeight: 'light', fontSize: '0.8rem', color: 'text.secondary' }}>
                          Remember me
                    </Typography>
                              }
                    />
                    <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                        mt: 1,
                        fontWeight: 'bold',
                        boxShadow: 4,
                        backgroundColor: '#1976d2',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                        backgroundColor: '#1565c0',
                        transform: 'scale(1.02)',
                        },
                    }}
                    >
                    {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                    </Button>


                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                        <Tooltip title="Iniciar con Google">
                            <IconButton 
                            onClick={() => signIn('google')}
                            disabled={isLoading}
                            sx={{ bgcolor: '#fff', '&:hover': { bgcolor: 'rgb(202, 0, 0)' } }}
                            >
                            <GoogleIcon sx={{ fontSize: 30, color: 'rgb(202, 0, 0)',transition: 'color 0.3s', '&:hover': { color: 'rgb(255, 255, 255)' } }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Iniciar con Facebook">
                            <IconButton 
                            onClick={() => signIn('facebook')}
                            disabled={isLoading}
                            sx={{ bgcolor: '#fff', '&:hover': { bgcolor: '#4267B2' } }}
                            >
                            <FacebookIcon sx={{ fontSize: 30, color: '#4267B2',transition: 'color 0.3s', '&:hover': { color: '#fff'} }} />
                            </IconButton>
                        </Tooltip>
                        </Box>

                </Box>
                <Grid container justifyContent={'space-between'} sx={{ mt: 1 }}>
                    <Grid item sx={{ mt: 1 }}>
                        <MuiLink component={Link} href="/auth/forgot" variant="body2">
                            ¿Olvidaste tu contraseña?
                        </MuiLink>
                    </Grid>
                    
                </Grid>
                
            </Paper>
        </Container>
    );
}

export default LoginForm;
