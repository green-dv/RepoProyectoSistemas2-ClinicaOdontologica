// import { NextRequest, NextResponse } from "next/server";
// import { getConnection } from "@/infrastructure/db/db";
// import { Patient } from "@/domain/entities/Patient";
// import { patientSchemavalidation } from "@/infrastructure/validators/PatientSchema";

// // Types para el delete
// type DeleteType = 'logical' | 'physical' | 'restore';

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const connection = await getConnection();
//     const { id } = params;
//     if (isNaN(Number(id))) {
//       return NextResponse.json(
//         { message: "ID de paciente inválido" },
//         { status: 400 }
//       );
//     }

//     const query = `
//       SELECT *
//       FROM getPatientById($1)
//     `;

//     const result = await connection.query(query, [id]);

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { message: "Paciente no encontrado" },
//         { status: 404 }
//       );
//     }

//     const patient = result.rows[0];
//     const patientData: Patient = {
//       idpaciente: patient.idpaciente,
//       nombres: patient.nombres,
//       apellidos: patient.apellidos,
//       direccion: patient.direccion,
//       telefonodomicilio: patient.telefonodomicilio || null,
//       telefonopersonal: patient.telefonopersonal || null,
//       lugarnacimiento: patient.lugarnacimiento || null,
//       fechanacimiento: patient.fechanacimiento || null,
//       sexo: patient.sexo || null,
//       estadocivil: patient.estadocivil || null,
//       ocupacion: patient.ocupacion || null,
//       aseguradora: patient.aseguradora || null,
//       habilitado: patient.habilitado || null,
//     };

//     return NextResponse.json(patientData);
//   } catch (error) {
//     console.error("Error fetching patient by ID:", error);
//     return NextResponse.json(
//       { message: "Error en el servidor", error: (error instanceof Error) ? error.message : String(error) },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const connection = await getConnection();
//     const body = await req.json();
//     const { id } = params;

//     // Validar que el ID sea un número por si acaso
//     if (isNaN(Number(id))) {
//       return NextResponse.json(
//         { message: "ID de paciente inválido" },
//         { status: 400 }
//       );
//     }
//     // validacion del zod
//     const validationResult = patientSchemavalidation.safeParse(body);
    
//     if (!validationResult.success) {
//       const errorMessages = validationResult.error.errors.map(err => 
//         `${err.path.join('.')}: ${err.message}`
//       );
      
//       return NextResponse.json(
//         { message: "Error de validación", errors: errorMessages },
//         { status: 400 }
//       );
//     }

//     const patient = validationResult.data;
    
//     // Verificar que el paciente exista antes de actualizar
//     const checkQuery = `SELECT COUNT(*) FROM getPatientById($1)`;
//     const checkResult = await connection.query(checkQuery, [id]);
    
//     if (parseInt(checkResult.rows[0].count) === 0) {
//       return NextResponse.json(
//         { message: "Paciente no encontrado" },
//         { status: 404 }
//       );
//     }

//     const query = `
//       SELECT * FROM updPatient($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)  
//     `;

//     const values = [
//       patient.nombres,
//       patient.apellidos,
//       patient.direccion,
//       patient.telefonodomicilio,
//       patient.telefonopersonal,
//       patient.lugarnacimiento,
//       patient.fechanacimiento,
//       patient.sexo,
//       patient.estadocivil,
//       patient.ocupacion,
//       patient.aseguradora,
//       id
//     ];

//     const result = await connection.query(query, values);

//     return NextResponse.json(
//       { message: "Paciente actualizado correctamente", patient: result.rows[0] as Patient },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating patient:", error);
//     return NextResponse.json(
//       { message: "Error en el servidor", error: (error instanceof Error) ? error.message : String(error) },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const connection = await getConnection();
//     const { id } = params;
    
//     if (isNaN(Number(id))) {
//       return NextResponse.json(
//         { message: "ID de paciente inválido" },
//         { status: 400 }
//       );
//     }

//     const url = new URL(req.url);
//     const deleteType = url.searchParams.get('type') as DeleteType || 'logical';
//     let body: { type?: DeleteType } = {};
//     try {
//       body = await req.json();
//     } catch {
//       // Si no hay body o está vacío, continuamos con los parámetros de URL
//     }

//     if (body && body.type === 'restore') {
//       const restoreQuery = "SELECT * FROM enablePatient($1)";
//       const result = await connection.query(restoreQuery, [id]);

//       if (result.rowCount === 0) {
//         return NextResponse.json({ message: "Paciente no encontrado" }, { status: 404 });
//       }

//       return NextResponse.json(
//         { message: "Paciente restaurado correctamente", patient: result.rows[0] as Patient },
//         { status: 200 }
//       );
//     }

//     if (deleteType === 'logical') {
//       const query = "SELECT * FROM diablePatient($1)";
//       const result = await connection.query(query, [id]);
      
//       if (result.rowCount === 0) {
//         return NextResponse.json({ message: "Paciente no encontrado" }, { status: 404 });
//       }
      
//       return NextResponse.json(
//         { message: "Paciente deshabilitado correctamente", patient: result.rows[0] as Patient },
//         { status: 200 }
//       );
//     } 
    
//     else if (deleteType === 'physical') {
//       const query = "SELECT * FROM deletePatient($1)";
//       const result = await connection.query(query, [id]);

//       if (result.rowCount === 0) {
//         return NextResponse.json({ message: "Paciente no encontrado" }, { status: 404 });
//       }

//       return NextResponse.json(
//         { message: "Paciente eliminado permanentemente", data: result.rows[0] as Patient },
//         { status: 200 }
//       );
//     } 
//     else {
//       return NextResponse.json(
//         { message: "Tipo de operación no válida. Usar 'logical', 'physical', o 'restore'." },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error("Error processing patient:", error);
//     return NextResponse.json(
//       { message: "Error del servidor", error: (error instanceof Error) ? error.message : String(error) },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { GetPatientByIdUseCase } from '@/application/usecases/patients/GetPatientByIdUseCases';
import { UpdatePatientUseCase } from '@/application/usecases/patients/UpdatePatientUseCases';
import { DeletePatientUseCase } from '@/application/usecases/patients/DeletePatientUseCases';

import { IPatientRepository } from '@/infrastructure/repositories/PatientRepository';

import { Patient } from '@/domain/entities/Patient';

const patientRepository = new IPatientRepository();
const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
const deletePatientUseCase = new DeletePatientUseCase(patientRepository);

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid patient ID' },
        { status: 400 }
      );
    }
    
    const patient = await getPatientByIdUseCase.execute(id);
    
    if (!patient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    console.error('Error getting patient:', error);
    return NextResponse.json(
      { message: 'Error retrieving patient' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid patient ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    if (!data.nombres || !data.apellidos) {
      return NextResponse.json(
        { message: 'Nombres y apellidos son requeridos' },
        { status: 400 }
      );
    }
    
    const patient: Patient = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      direccion: data.direccion || '',
      telefonodomicilio: data.telefonodomicilio || '',
      telefonopersonal: data.telefonopersonal || '',
      lugarnacimiento: data.lugarnacimiento || '',
      fechanacimiento: data.fechanacimiento || '',
      sexo: data.sexo !== undefined ? data.sexo : true,
      estadocivil: data.estadocivil || '',
      ocupacion: data.ocupacion || '',
      aseguradora: data.aseguradora || '',
      habilitado: data.habilitado !== undefined ? data.habilitado : true
    };
    
    const updatedPatient = await updatePatientUseCase.execute(id, patient);
    
    if (!updatedPatient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { message: 'Error updating patient' },
      { status: 500 }
    );
  }
}

// DELETE /api/pacientes/[id]
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
try{
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid patient ID' },
        { status: 400 }
      );
    }
    
    const result = await deletePatientUseCase.execute(id);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Patient not found or already deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Patient successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { message: 'Error deleting patient' },
      { status: 500 }
    );
  }
}