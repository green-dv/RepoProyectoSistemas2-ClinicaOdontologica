import { User } from "@/entities/user";
import { getConnection } from "../db/db";

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const connection = getConnection();
  
    try{
//============================================================================
// !!IMPORTANTE!! CAMBIAR A UN PROCEDIMIENTO ALMACENADO ESTA QUERY
//============================================================================
        const result = await connection.query(
            "SELECT * FROM usuarios WHERE email = $1 LIMIT 1", 
        [email]
        );
    
        if (result.rows.length === 0) return null;
    
        return result.rows[0] as User;
    }catch (error) {
        console.error("Error fetching user by email:", error);
        throw new Error("Failed to retrieve user by email");
    }
};
export const createUser = async (nombre: string, apellido:string, email: string, hashedPassword: string): Promise<User> => {
    const connection = getConnection();

    try{
//============================================================================
// !!IMPORTANTE!! CAMBIAR A UN PROCEDIMIENTO ALMACENADO ESTA QUERY
//============================================================================
        const result = await connection.query(
            "INSERT INTO usuarios (nombre, apellido, email, password) VALUES ($1, $2, $3, $4) RETURNING *;",
            [nombre, apellido, email, hashedPassword]
        );

        if (result.rows.length === 0) throw new Error("Error al crear el usuario");

        return result.rows[0] as User;
    }catch (error) {
        console.error("Error creating user:" + nombre + ' ' + apellido + ' ' + email + ' ' + hashedPassword , error);
        throw new Error("Error al crear el usuario");
    }
}