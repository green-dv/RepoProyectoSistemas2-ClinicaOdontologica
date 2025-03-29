import bcrypt from "bcryptjs";
import { User } from "@/entities/user"
import { findUserByEmail, createUser } from "@/infrastructure/repositories/userRepository";

//###################################################
//La siguiente funcion devuelve un usuario creado mediante un llamado a la base de datos
//###################################################
export async function registerUser(nombre: string, apellido: string, email: string, password: string): Promise<User> {
    const usuarioExistente = await findUserByEmail(email);
    if(usuarioExistente) throw new Error("El usuario ya existe");

    const hashedPassword = await bcrypt.hash(password, 10);
    return await createUser(nombre, apellido, email, hashedPassword);
}