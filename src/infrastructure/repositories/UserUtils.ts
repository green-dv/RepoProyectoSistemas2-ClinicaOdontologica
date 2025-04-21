'use server';
import { User } from "@/domain/entities/user";
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