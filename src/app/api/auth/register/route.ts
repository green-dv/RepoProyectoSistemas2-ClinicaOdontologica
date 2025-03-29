import { NextResponse } from "next/server";
import { registerUser } from "@/usecases/registerUser";

//###################################################
//La siguiente funcion llama a la funcion de crear un usuario con la funcion de registerUser declara en /usecases/registerUser.ts
//###################################################
export async function POST(req: Request) {
    try{
        const { nombre, apellido, email, password } = await req.json();
        const newUser = await registerUser(nombre, apellido, email, password);
        return NextResponse.json({ message: "Usuario creado", user: newUser }, { status: 201 });
    }catch (error: any) {
        console.error("Error en el registro:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}