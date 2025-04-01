//============================================================================
// interfas de la entidad tratamientos
//============================================================================
export interface Treatments {
    idtratamiento: number;
    nombre: string;
    descripcion: string;
    precio: number;
    habilitado: boolean;
}

// esto solo porsiacaso no funca con una interface
// type Treatments = {
//   idproducto: number;
//   nombre: string;
//   descripcion: string;
//   precio: number;
//   habilitado: string;
// };



// CREATE TABLE tratamientos(
//     idtratamiento SERIAL PRIMARY KEY,
//     nombre VARCHAR(50),
//     descripcion TEXT,
//     precio NUMERIC(10,2),
//     habilitado BOOLEAN DEFAULT TRUE
//   );