"use client";

import { useEffect, useState } from "react";
import { obtenerTareasEjemplos } from "../../../services/ejemploService";
import Link from "next/link";

export default function EjemplosPage({params}: {params: Promise<{id: string}>}) {
    const [ejemplos, setEjemplos] = useState<any[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);
    const [tareaId, setTareaId] = useState<string>("");
    const [resolvedParams, setResolvedParams] = useState<{id: string} | null>(null);

    useEffect(() => {
        async function unwrapParams() {
            const unwrappedParams = await params;
            setResolvedParams(unwrappedParams);
        }
        unwrapParams();
    }, [params]);

    useEffect(() => {
        async function cargarEjemplos() {
            if (!resolvedParams) return;
            try {
                const datos = await obtenerTareasEjemplos(resolvedParams.id);
                setEjemplos(datos);
            } catch (error) {
                console.error("Error al cargar los ejemplos:", error);
            } finally {
                setLoading(false);
            }
        }

        cargarEjemplos();
    }, [resolvedParams]); 

    return (
        <div>
        <h1>Tareas de {ejemplos[0]?.persona}</h1>
        {loading ? (
            <p>Cargando...</p> 
        ) : (
            <ul>
            {ejemplos.map((ejemplo) => (
                <li key={ejemplo.id}>
                    <Link href={`/ejemplos/${ejemplo.id}`}>{ejemplo.tarea}</Link>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}


/*
  Explicación de los hooks y funciones utilizados:

  1. useState:
     - Hook de React que permite manejar el estado en componentes funcionales.
     - En este código se usa para manejar:
       - 'ejemplos': Lista de tareas obtenidas de la API.
       - 'loading': Indica si los datos están cargando.
       - 'tareaId': Almacena el ID de la tarea seleccionada.
       - 'resolvedParams': Guarda los parámetros de la URL después de resolverlos.

  2. useEffect:
     - Se usa para ejecutar efectos secundarios en el componente, como llamadas a APIs.
     - Hay dos useEffect en este código:
       a) El primero resuelve los parámetros recibidos como una promesa.
       b) El segundo se activa cuando 'resolvedParams' cambia, cargando las tareas de la persona correspondiente.

  3. unwrapParams:
     - Función asincrónica que espera la resolución de los parámetros (params) antes de asignarlos a 'resolvedParams'.
     - Se ejecuta en el primer useEffect.

  4. cargarEjemplos:
     - Función asincrónica que obtiene las tareas de la API usando 'obtenerTareasEjemplos'.
     - Solo se ejecuta si 'resolvedParams' tiene un valor válido.
     - Maneja errores y actualiza el estado 'ejemplos' con los datos obtenidos.

  5. Link:
     - Componente de Next.js que reemplaza a <a> para mejorar la navegación sin recargar la página.
     - Cada tarea tiene un enlace dinámico basado en su ID.


    MANERA DE USAR useState()

    En React, useState es una función especial llamada "hook" que nos permite manejar datos que cambian dentro de un componente.

    Cuando usamos useState, obtenemos dos cosas:

    Una variable donde guardamos el dato.
    Una función que nos permite cambiar ese dato.
    Cada vez que usamos useState, le damos un valor inicial. React se encarga de recordar ese valor y actualizarlo cuando lo cambiamos con la función.
    
    const [ejemplos, setEjemplos] = useState<any[]>([]);
    ejemplos: Es una variable que almacena una lista vacía [] al inicio. Aquí guardaremos las tareas que vienen de la base de datos.
    setEjemplos: Es la función que usaremos para actualizar la lista cuando obtengamos datos.
*/ 
