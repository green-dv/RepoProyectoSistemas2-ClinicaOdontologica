//============================================================================
// Modelos de la entidades
//============================================================================
/* 
  aqui deben ir todas las interfaces para cada una de las entidades
  que se van a utilizar en el proyecto, de esta manera es mas facil
  reutilzar el codigo y mantenerlo ordenado
  :>
*/


//============================================================================
// interfas de la entidad usuario para el inicio de sesion
//============================================================================
export interface User {
    idusuario: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    fecha_registro: Date;
    habilitado: boolean;
}



