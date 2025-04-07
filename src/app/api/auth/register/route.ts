// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/infrastructure/db/db'; // Adjust path as needed
import bcryptjs from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, apellido, email, password } = body;
    
    // Validate input
    if (!nombre || !apellido || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const conn = getConnection();
    
    // Check if email already exists
    const emailExistsQuery = 'SELECT * FROM usuarios WHERE email = $1';
    const emailResult = await conn.query(emailExistsQuery, [email]);
    
    if (emailResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    // Get next idusuario (auto-increment alternativ
    
    // Insert new user
    const insertQuery = `
        INSERT INTO usuarios (nombre, apellido, email, password, habilitado)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING idusuario, nombre, apellido, email, habilitado, fecha_registro
    `;
        
    const values = [nombre, apellido, email, hashedPassword, true];
    const result = await conn.query(insertQuery, values);
    
    return NextResponse.json({
      user: result.rows[0],
      message: 'User registered successfully'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
        { 
          error: 'Error registering user', 
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
  }
}