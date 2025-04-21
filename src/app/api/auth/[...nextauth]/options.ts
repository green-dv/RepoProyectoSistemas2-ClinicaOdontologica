import type { NextAuthOptions } from "next-auth";
//============================================================================
// IMPORTACION DE PROVEEDORES DE AUTENTICACION DE GOOGLE Y CREDENCIALES
// DE LA BD.
// con bcrypt se encripta la contraseña para compararla con la de la bd
//============================================================================
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/infrastructure/repositories/UserUtils";
import bcrypt from 'bcryptjs';

export const options: NextAuthOptions = {
    providers: [
//============================================================================
// Esto de google tanto como id y el secret estan en el archivo .env.local
// pero no creo que sea necesario lo de google KIZZ
//============================================================================
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }),
//============================================================================
// Este es para los inputs del formulario de login
//============================================================================
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
//============================================================================
// Validacion del email y password
//============================================================================                
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                try {
//============================================================================
// el la funcion findUserByEmail esta en ingrastructure/repositories/userRepository  al igual que la interface de usuario esta en la carpeta entities
//============================================================================
                    const user = await findUserByEmail(credentials.email);

                    if (!user || !user.habilitado) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password, 
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }
                    
                    return {
                        id: user.idusuario.toString(),
                        idusuario: user.idusuario,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        email: user.email,
                        cambiopassword: user.cambiopassword,
                        habilitado: user.habilitado
                    };
                } catch (error) {
                    console.error('Authentication failed error :") :', error);
                    return null;
                }
            }
        })
    ],
//============================================================================
// aqui se encuentran los callbacks de sesion y jwt
// el de session se encarga de guardar los datos del usuario en la sesion
// el de jwt se encarga de guardar los datos del usuario en el token
// Aqui ocurria un error de type en el seesion del callback asi que para que 
// eslint no moleste se creo un type para la session esta en types/next-auth.d.ts
//============================================================================
    callbacks: {
        async signIn({ user }) {
            try {
                const existingUser = await findUserByEmail(user.email!);
                console.log("existingUser", existingUser);
                if (!existingUser) {
                    throw new Error("Usuario no encontrado");
                }
                return true;
              } catch (error) {
                console.log("Error en la autenticación:", error);
                throw new Error(error as string);
              }
            return true;              
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                idusuario: token.idusuario,
                nombre: token.nombre,
                apellido: token.apellido,
                email: token.email,
                cambiopassword: token.cambiopassword,
                habilitado: token.habilitado
            };
            
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.idusuario = user.idusuario;
                token.nombre = user.nombre;
                token.apellido = user.apellido;
                token.email = user.email;
                token.habilitado = user.habilitado;
                token.cambiopassword = user.cambiopassword;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            try {
                const parsedUrl = new URL(url, baseUrl); // ← esta línea soluciona el error
        
                // Ejemplo: redirigir a otra página si va a la raíz
                if (parsedUrl.pathname === "/") {
                    return "/"; // o donde quieras redirigir
                }
        
                return url;
            } catch (error) {
                console.error("Error en redirect callback:", error);
                return "/auth/error"; // redirección por defecto en caso de error
            }
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error'
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 4, // esto son 4 minutos creo 
    }
}