'use client';
import * as React from 'react';
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import {
    Box, 
    TextField, 
    Typography, 
    Button,
    Container, 
    Paper,
    Avatar, 
    Grid,
    Link as MuiLink,
    Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export function RegisterForm() {
    const { data: session, status } = useSession();
    const router = useRouter();
//###################################################
//El siguiente bloque de codigo se encarga de redirigir al usuario a la pagina principal si ya esta autenticado
//###################################################
    React.useEffect(() => {
        if (status === "authenticated") {
            router.push('/'); 
        }
    }, [status, router]);
    const [nombre, setNombre] = React.useState('');
    const [apellido, setApellido] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            setIsLoading(false);
            return;
        }
        if (!nombre || !apellido || !email || !password) {
            setError("Faltan datos");
            setIsLoading(false);
            return;
        }
        try {
//###################################################
//El siguiente bloque de codigo verifica que todo este bien y envia un post a dicha ruta de la api
//###################################################
            
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setSuccess("Registro exitoso. Redirigiendo...");
            const result = await signIn('credentials', {
                                    redirect: false,
                                    email,
                                    password,
                                });
            router.push('/');
        } catch (err: any) {
            setError(err.message || "Ocurrió un error durante el registro");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
                <Avatar
                    sx={{
                        mx: "auto",
                        bgcolor: "secondary.main",
                        textAlign: "center",
                        mb: 1,
                    }}
                >
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{textAlign: 'center'}}>
                    Registrarse
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                        {success}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField 
                        fullWidth 
                        label="Nombre" 
                        margin="normal" 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Apellido"
                        margin="normal"
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        required
                    />
                    <TextField 
                        fullWidth 
                        label="Correo Electrónico" 
                        margin="normal" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField 
                        fullWidth 
                        label="Contraseña" 
                        margin="normal" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField 
                        fullWidth 
                        label="Confirmar Contraseña" 
                        margin="normal" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 1 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </Button>
                </Box>
                <Grid container justifyContent={'space-between'} sx={{ mt: 1 }}>
                    <Grid item>
                        <MuiLink component={Link} href="/login" variant="body2">
                            ¿Ya tienes una cuenta? Inicia sesión
                        </MuiLink>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default RegisterForm;
