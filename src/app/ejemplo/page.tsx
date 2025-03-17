//============================================================================
// Ejemplo de page en React
//============================================================================
/*
  Este archivo es un componente funcional que muestra una lista de "ejemplos" obtenidos desde un servicio externo.
  El componente utiliza hooks de React como `useState` y `useEffect` para gestionar el estado y ejecutar efectos secundarios.

  1. **useState**:
     - `useState` es un hook de React que se usa para manejar el estado dentro de un componente funcional. 
     - En este caso, hay dos estados definidos:
       - `ejemplos`: Un array que guarda los datos obtenidos (por ejemplo, una lista de ejemplos de la base de datos).
       - `loading`: Un booleano que indica si los datos todavía están siendo cargados (true) o si ya se han cargado (false).

  2. **useEffect**:
     - `useEffect` es un hook de React que permite ejecutar efectos secundarios en componentes funcionales, tales como llamadas a API, suscripciones, o manipulación directa del DOM.
     - En este caso, `useEffect` se usa para ejecutar la función `cargarEjemplos` al cargar el componente por primera vez. 
     - La función `cargarEjemplos` es asíncrona, hace una solicitud para obtener datos de un servicio, y actualiza el estado de `ejemplos` y `loading` dependiendo de si la carga fue exitosa o no.

  **Flujo**:
  - Cuando el componente se monta, se ejecuta el `useEffect`.
  - `cargarEjemplos` hace una llamada a la función `obtenerEjemplos` (definida en el servicio) para obtener los datos desde una API.
  - Cuando los datos son obtenidos correctamente, se actualiza el estado `ejemplos` y `loading` se pone a `false`.
  - Si ocurre un error durante la carga de los datos, se captura el error y se muestra un mensaje en la consola.

*/

"use client"; // Esto indica que el archivo está diseñado para ejecutarse en el cliente (lado del navegador)

import { useEffect, useState } from "react"; // Importa los hooks de React
import { obtenerEjemplos } from "../../services/ejemploService"; // Importa la función que obtiene los datos desde el servicio
import Link from "next/link"; //En lugar de usar etiqueta a se usa el componente Link

// Componente funcional EjemplosPage
export default function EjemplosPage() {
  // Definición de los estados
  // 'ejemplos' es el estado que guardará los datos obtenidos de la API (inicialmente vacío)
  const [ejemplos, setEjemplos] = useState<any[]>([]); 

  // 'loading' es un estado booleano que indica si los datos se están cargando
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    // Función asíncrona para cargar los ejemplos desde la API
    async function cargarEjemplos() {
      try {
        // Llama al servicio para obtener los datos
        const datos = await obtenerEjemplos();
        // Una vez obtenidos los datos, actualiza el estado de 'ejemplos'
        setEjemplos(datos);
      } catch (error) {
        // Si hay un error al obtener los datos, lo captura y muestra en consola
        console.error("Error al cargar los ejemplos:", error);
      } finally {
        // En cualquier caso, independientemente de si la solicitud fue exitosa o no, actualiza el estado 'loading' a false
        setLoading(false);
      }
    }

    // Llama a la función para cargar los ejemplos
    cargarEjemplos();
  }, []); // El array vacío [] asegura que el efecto solo se ejecute una vez, cuando el componente se monte

  return (
    <div>
      <h1>Ejemplos</h1>
      {/* Si 'loading' es true, muestra el mensaje de carga */}
      {loading ? (
        <p>Cargando...</p> 
      ) : (
        // Si los datos están cargados, muestra la lista de ejemplos
        <ul>
          {ejemplos.map((ejemplo) => (
            // Cada ejemplo se renderiza como un ítem en la lista
            <li key={ejemplo.id}>
                <Link href={`/ejemplo/${ejemplo.id}`}>{ejemplo.nombre}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
