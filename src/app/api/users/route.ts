import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/infrastructure/db/db";
import { User } from "@/domain/entities/user";
import bcryptjs from 'bcryptjs';

// PATCH para cambiar la contraseña
export async function PATCH(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const connection = getConnection();
    console.log("La nueva contrasena es: ", password);
    const hashedPassword = await bcryptjs.hash(password, 10);
    await connection.query(
      "UPDATE usuarios SET password = $1, cambiopassword=false WHERE email = $2",
      [hashedPassword, email]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Error updating password" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const connection = getConnection();

    const result = await connection.query(
      "SELECT * FROM usuarios WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    const user = result.rows[0] as User;
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user by email" },
      { status: 500 }
    );
  }
}