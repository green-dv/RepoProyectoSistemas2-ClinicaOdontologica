// import {NextRequest,NextResponse} from 'next/server';
// import {getConnection} from "@/infrastructure/db/db";
// import { patientSchemavalidation } from '@/infrastructure/validators/PatientSchema';
// import { Patient } from '@/domain/entities/Patient';
// import { PatientsResponse } from '@/application/dtos/PatientResponse';

// export async function GET(request: NextRequest) {
//     try {
//       const connection = await getConnection();
//       const url = new URL(request.url);
//       const searchTerm = url.searchParams.get('q') || '';
//       const page = parseInt(url.searchParams.get('page') || '1');
//       const limit = parseInt(url.searchParams.get('limit') || '10');
//       const offset = (page - 1) * limit;
  
//       let query = `SELECT * FROM getPatients() AS p`;
//       const values: string[] = [];
//       let paramIndex = 1;
  
//       if (searchTerm) {
//         query += ` WHERE p.nombres ILIKE $${paramIndex} OR p.apellidos ILIKE $${paramIndex}`;
//         values.push(`%${searchTerm}%`);
//         paramIndex++;
//       }
  
//       query += ` ORDER BY p.idpaciente DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
//       values.push(limit.toString(), offset.toString());
  
//       const result = await connection.query(query, values);
  
//       const countQuery = `
//         SELECT COUNT(*) FROM getPatients() AS p
//         ${searchTerm ? `WHERE p.nombres ILIKE $1 OR p.apellidos ILIKE $1` : ''}
//       `;
//       const countValues = searchTerm ? [`%${searchTerm}%`] : [];
//       const countResult = await connection.query(countQuery, countValues);
//       const totalCount = parseInt(countResult.rows[0].count);
  
//       const response: PatientsResponse = {
//         data: result.rows as Patient[],
//         pagination: {
//           page,
//           limit,
//           totalItems: totalCount,
//           totalPages: Math.ceil(totalCount / limit)
//         }
//       };
  
//       return NextResponse.json(response);
//     } catch (error) {
//       console.error("Error al obtener pacientes:", error);
//       return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
//     }
//   }
  
//   export async function POST(req: NextRequest) {
//     try {
//       const body = await req.json();
//       const validationResult = patientSchemavalidation.safeParse(body);
  
//       if (!validationResult.success) {
//         const errorMessages = validationResult.error.errors.map(err =>
//           `${err.path.join('.')}: ${err.message}`
//         );
  
//         return NextResponse.json(
//           { message: "Error de validación", errors: errorMessages },
//           { status: 400 }
//         );
//       }
  
//       const patient = validationResult.data;
//       const connection = await getConnection();
  
//       const checkQuery = `
//         SELECT COUNT(*) FROM getPatients() AS p
//         WHERE p.nombres = $1 AND p.apellidos = $2
//       `;
//       const checkResult = await connection.query(checkQuery, [patient.nombres, patient.apellidos]);
  
//       if (parseInt(checkResult.rows[0].count) > 0) {
//         return NextResponse.json(
//           { message: "Ya existe un paciente con este nombre y apellido" },
//           { status: 409 }
//         );
//       }
  
//       const insertQuery = `
//         SELECT * FROM addPatient($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//       `;
//       const values = [
//         patient.nombres,
//         patient.apellidos,
//         patient.direccion,
//         patient.telefonodomicilio || null,
//         patient.telefonopersonal,
//         patient.lugarnacimiento || '',
//         patient.fechanacimiento,
//         patient.sexo,
//         patient.estadocivil,
//         patient.ocupacion,
//         patient.aseguradora || null
//       ];
  
//       const result = await connection.query(insertQuery, values);
  
//       return NextResponse.json(
//         { message: "Paciente creado exitosamente", patient: result.rows[0] as Patient },
//         { status: 201 }
//       );
//     } catch (error) {
//       console.error("Error al crear paciente:", error);
//       return NextResponse.json(
//         { message: "Error al crear paciente", error: (error instanceof Error) ? error.message : String(error) },
//         { status: 500 }
//       );
//     }
//   }


import { NextRequest, NextResponse } from 'next/server';
import { IPatientRepository } from '@/infrastructure/repositories/PatientRepository';
import { GetPatientsUseCase } from '@/application/usecases/patients/GetPatientsUseCases';
import { CreatePatientUseCase } from '@/application/usecases/patients/CreatePatientUseCases';
import { Patient } from '@/domain/entities/Patient';
  
const patientRepository = new IPatientRepository();
const getPatientsUseCase = new GetPatientsUseCase(patientRepository);
const createPatientUseCase = new CreatePatientUseCase(patientRepository);
  
export async function GET(request: NextRequest) {
    try {
        // Extract pagination parameters from query string
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        
        const patients = await getPatientsUseCase.execute(page, limit);
        return NextResponse.json(patients, { status: 200 });
    } catch (error) {
        console.error('Error getting patients:', error);
        return NextResponse.json(
          { message: 'Error retrieving patients' }, 
          { status: 500 }
        );
    }
}
  
  // POST /api/pacientes
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        // Basic validation
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
      
        const createdPatient = await createPatientUseCase.execute(patient);
        return NextResponse.json(createdPatient, { status: 201 });
    } catch (error) {
        console.error('Error creating patient:', error);
        return NextResponse.json(
          { message: 'Error creating patient' },
          { status: 500 }
        );
    }
}