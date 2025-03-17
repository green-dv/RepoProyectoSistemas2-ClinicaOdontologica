//============================================================================
// Ejemplo de servicios
//============================================================================
/*
    Muchachines, espero que esten leyendo esto.

    Un servicio es una clase que se encarga de realizar una tarea especifica,
    en este caso se encarga de obtener los datos que llegan desde la API

    Es necesario separar las funciones del servidor y del cliente para lograr
    que el servidor sea lo mas eficiente posible

    Los servicios por lo general se ejecutan en el lado del cliente, y la API
    en el lado del servidor

    Usamos el lado del servidor cuando queremos:
    1. Solicitud de datos a la API desde el cliente (Este caso)
    2. Renderizar una pagina o interaccion con el usuario (UI)
    3. Funciones de componentes, ej al hacer click en botones
    4. Cuando manipulamos informacion en el lado del navegador, como cookies, almacenamiento interno, o navegacion entre paginas (useRouter)
*/
"use client";
import { useEffect, useState } from "react";
export async function obtenerEjemplos() {
    try {
        const res = await fetch("/api/ejemplo", { cache: "no-store" });
      
        if (!res.ok) throw new Error("Error al obtener los datos");
        const data = await res.json();
        console.log("Datos obtenidos:", data);
        return data;
    } catch (error) {
        console.error("Error en obtenerEjemplos:", error);
        throw error; 
    }
}
  
export async function agregarEjemplo(datos: { nombre: string }) {
    try {
        const res = await fetch("/api/ejemplo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });
      
        if (!res.ok) throw new Error("Error al agregar el ejemplo");
      
        return res.json();
    } catch (error) {
        console.error("Error en agregarEjemplo:", error);
        throw error; 
    }
} 



export async function obtenerTareasEjemplos(id:string) {
    try{
        const res = await fetch(`/api/ejemplo/${id}`);
        if (!res.ok) throw new Error("Error al obtener los datos");
        const data = await res.json();
        console.log("Datos obtenidos:", data);
        return data;
    } catch(error){
        console.error("Error en obtenerEjemplos:", error);
        throw error; 
    }
}