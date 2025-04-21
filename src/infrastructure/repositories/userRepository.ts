
import { User } from "@/domain/entities/user";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { getConnection } from "../db/db";

export class UserRepository implements IUserRepository {

  async changeUserPassword(email: string, password: string): Promise<boolean> {
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Error al cambiar la contraseña");

    const data = await res.json();
    return data.success;
  }

  async sendVerificationCode(email: string, code: number): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/recovery", {
        method: "POST",
        body: JSON.stringify({ email, code }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      return true;
    } catch (error) {
      console.error("Error al enviar el código de verificación:", error);
      return false;
    }
  }
}

export const userRepository = new UserRepository();
