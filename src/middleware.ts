export { default } from "next-auth/middleware";
//============================================================================
// EN EL MATCHER ES UN ARRAY DONDE SE DEBE PONER TODAS LAS RUTAS QUE NECESITEN AUTENTICACION
// PARA QUE NEXT-AUTH LAS PROTEJA
// EN ESTE CASO SOLO PUSE EJEPLITOS
//============================================================================
export const config = {matcher: ["/","/treatments"]}