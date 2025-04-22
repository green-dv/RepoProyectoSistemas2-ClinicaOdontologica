
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react'; // Asegúrate de importar signIn
import { changeUserPassword } from "@/application/usecases/userVerification";
import { findUserByEmail } from "@/infrastructure/repositories/UserUtils";
import { sendVerificationCode } from '@/application/usecases/userVerification';
import{
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useSession } from 'next-auth/react';

export default function PasswordRecoveryComponent(){
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inputCode, setInputCode] = useState(0);
  const [sentCode, setSentCode] = useState(0);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(true);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const router = useRouter();

  const params = useSearchParams();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated" && !session?.user?.cambiopassword) {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const emailParam = params.get('email');
    const recoveryParam = params.get('passwordRecovery');
  
    if (emailParam) {
      setEmail(emailParam);
    }
  
    if (recoveryParam === 'true') {
      setIsPasswordRecovery(true);
    } else if (recoveryParam === 'false') {
      setIsPasswordRecovery(false);
    }
  }, [params]);
  
  
  const handleSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log();
    event.preventDefault();
    setError('');
    if(email === ''){
      setError('Por favor, coloca tu correo');
      return;
    }
    const existingUser = await findUserByEmail(email);
    if(!existingUser){
      setError('No se encontró al usuario con ese correo');
      return;
    }
    try{
      const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      setSentCode(code);
      console.log(code);
      const emailSent = await sendVerificationCode(email, code);
      setError('');
      if(!emailSent){
        setError('Error al enviar el correo de verificación');
        return;
      }
      setIsCodeSent(true);
    } catch(error){
      console.log("Error al enviar el correo: ", error);
    }
  };

  const handleSubmitNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if(!(/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password))){
      setError('La contrasña debe tener caracteres especiales, mayúsculas, minúsculas y números');
      return;
    }
    if(password.length < 8){
      setError('La contrasña debe tener por lo menos 8 caracteres');
      return;
    }
    if(password !== confirmPassword){
      setError('Las contrasñas no coinciden');
      return;
    }
    if(sentCode != inputCode){
      setError('El código de verificación no es correcto');
      return;
    }
    try{
      changeUserPassword(email, password);
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
  
      if (result?.error) {
        setError('Error al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.');
      } 
      const session = await getSession();
      
      if(session?.user?.cambiopassword){
        router.push(`/auth/recovery?passwordRecovery=true&email=${session.user.email}`);
      } else {
          router.push('/');
      }
    } catch(error){
      console.log("Error en la verificacion", error);
      setError("Error en la verificación, inténtelo más tarde");
    }
  }

  return (
    <Paper elevation={10} sx={{ padding: 5, maxWidth: 500, margin: '40px auto' }}>
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
    {
      isPasswordRecovery ? (
        <VpnKeyIcon sx={{ fontSize: 40 }} />
      ) : (
        <LockIcon sx={{ fontSize: 40 }} />
      )
    }
    <Typography variant="h5" align="center">
      {isPasswordRecovery ? 'Recuperar contraseña' : 'Cambio de contraseña'}
    </Typography>

    <Typography variant="body2" align="center" sx={{ maxWidth: 400 }}>
      {
        isPasswordRecovery
          ? 'Cambia tu contraseña llenando tu email con el que estás registrado y coloca debajo el código de verificación que enviaremos a tu correo.'
          : 'Se requiere que cambies tu contraseña. Por favor, coloca el código de verificación que enviaremos a tu correo.'
      }
    </Typography>

    {error && (
      <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
        {error}
      </Alert>
    )}

    <Box component="form" onSubmit={handleSubmitEmail} noValidate sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <TextField
        type="email"
        label="Email"
        fullWidth
        value={email?email:''}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" variant="contained" fullWidth>
        Obtener código de verificación
      </Button>
    </Box>

    <Typography variant="body2" align="center" sx={{ maxWidth: 400 }}>
      {
        isCodeSent
          ? "Código de verificación enviado a tu correo."
          : "Cuando termines de colocar tu correo, pulsa en enviar para obtener tu código de verificación."
      }
    </Typography>

    <Box component="form" onSubmit={handleSubmitNewPassword} noValidate sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <TextField
        type="number"
        label="Código de verificación"
        name="code"
        fullWidth
        onChange={(e) => setInputCode(Number(e.target.value))}
        disabled={!isCodeSent}
      />
      <TextField
        type="password"
        label="Nueva contraseña"
        name="password"
        fullWidth
        onChange={(e) => setPassword(e.target.value)}
        disabled={!isCodeSent}
      />
      <TextField
        type="password"
        label="Repetir contraseña"
        name="confirmPassword"
        fullWidth
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={!isCodeSent}
      />
      <Button type="submit" variant="contained" disabled={!isCodeSent} fullWidth>
        Enviar
      </Button>
    </Box>
  </Box>
</Paper>

  );
};