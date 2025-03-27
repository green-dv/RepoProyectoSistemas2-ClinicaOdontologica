import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//============================================================================
// ESTOS SON COMPONENTES DEL MATERIAL UI SI SE PUEDE AGRGAR ESTILOS ESTARIA BIEN
//============================================================================

export function LoginForm() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

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
                    Iniciar Sesión
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                    <FormControlLabel
                        control={<Checkbox value='remember' color='primary'/>}
                        label='Remember me'
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 1 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                    </Button>
                </Box>
                <Grid container justifyContent={'space-between'} sx={{ mt: 1 }}>
                    <Grid item>
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