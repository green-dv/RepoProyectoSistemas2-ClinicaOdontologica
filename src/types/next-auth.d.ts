import "next-auth";
import  "@/entities/user"; 

declare module "next-auth" {
  interface User {
    id: string;
    idusuario: number;
    nombre: string;
    apellido: string;
    email: string;
    habilitado: boolean;
  }

  interface Session {
    user: {
      id: string;
      idusuario: number;
      nombre: string;
      apellido: string;
      email: string;
      habilitado: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    idusuario: number;
    nombre: string;
    apellido: string;
    email: string;
    habilitado: boolean;
  }
}