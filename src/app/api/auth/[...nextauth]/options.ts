import type { NextAuthOptions } from "next-auth";
//============================================================================
// IMPORTACION DE PROVEEDORES DE AUTENTICACION DE GOOGLE Y CREDENCIALES
// DE LA BD.
// con bcrypt se encripta la contraseña para compararla con la de la bd
//============================================================================
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/infrastructure/repositories/userRepository";
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
        async session({ session, token }) {
            session.user = {
                id: token.id,
                idusuario: token.idusuario,
                nombre: token.nombre,
                apellido: token.apellido,
                email: token.email,
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
            }
            return token;
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