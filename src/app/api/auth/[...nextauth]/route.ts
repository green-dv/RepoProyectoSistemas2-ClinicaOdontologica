//============================================================================
// USO DE NEXT-AUTH app Router
//============================================================================
/* 
    Aqui se importa las opciones de configuracion de la autenticacion
    como los proveedores y los callbacks de sesion y jwt
*/

import NextAuth from 'next-auth';
import {options} from './options';

//============================================================================
// HANDLER DE OPCIONES DE CONFIGURACION DE NEXT-AUTH
//============================================================================
/* 
    Aqui se crea el handler que se exporta para que nextjs lo pueda usar
    como un endpoint de autenticacion,
    GET ==> DEVUELVE LA SESION ACTUAL
    POST ==> MANEJA EL INICIO Y CIERRE DE SESION
*/

const handler = NextAuth(options);
export { handler as GET, handler as POST }
