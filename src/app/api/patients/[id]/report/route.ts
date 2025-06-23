import { NextRequest, NextResponse } from 'next/server';
import { GetPatientByClinicalRecordIDUseCase } from '@/application/usecases/patients/GetPatientByClinicalRecordIDUseCases';
import { IPatientRepository } from '@/infrastructure/repositories/PatientRepository';

const patientRepository = new IPatientRepository();
const getPatientByClinicalRecordIDUseCase = new GetPatientByClinicalRecordIDUseCase(patientRepository);


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id); 

        
        if (isNaN(id)) {
            return NextResponse.json(
                { 
                    success: false,
                    message: 'ID de paciente inválido',
                    error: 'INVALID_PATIENT_ID'
                },
                { status: 400 }
            );
        }

        const clinicalRecord = await getPatientByClinicalRecordIDUseCase.execute(id);

        if (!clinicalRecord) {
            return NextResponse.json(
                { 
                    success: false,
                    message: 'Paciente no encontrado o sin antecedentes clínicos',
                    error: 'PATIENT_NOT_FOUND'
                },
                { status: 404 }
            );
        }

        // Formatear la respuesta para el reporte
        const reportData = {
            success: true,
            message: 'Historial clínico obtenido exitosamente',
            data: {
                paciente: {
                    id: clinicalRecord.idpaciente,
                    nombres: clinicalRecord.nombres,
                    apellidos: clinicalRecord.apellidos,
                    nombreCompleto: `${clinicalRecord.nombres} ${clinicalRecord.apellidos}`,
                    direccion: clinicalRecord.direccion,
                    telefonodomicilio: clinicalRecord.telefonodomicilio,
                    telefonopersonal: clinicalRecord.telefonopersonal,
                    lugarnacimiento: clinicalRecord.lugarnacimiento,
                    fechanacimiento: clinicalRecord.fechanacimiento,
                    sexo: clinicalRecord.sexo ? 'Masculino' : 'Femenino',
                    estadocivil: clinicalRecord.estadocivil,
                    ocupacion: clinicalRecord.ocupacion,
                    aseguradora: clinicalRecord.aseguradora
                },
                historialClinico: {
                    totalAntecedentes: clinicalRecord.antecedentes.length,
                    antecedentes: clinicalRecord.antecedentes.map(ant => ({
                        id: ant.idantecedente,
                        fecha: ant.fecha_antecedente,
                        embarazo: ant.tiene_embarazo,
                        enfermedades: ant.enfermedades ? ant.enfermedades.split(', ') : [],
                        atencionesmedicas: ant.atenciones_medicas ? ant.atenciones_medicas.split(', ') : [],
                        medicaciones: ant.medicaciones ? ant.medicaciones.split(', ') : [],
                        habitos: ant.habitos ? ant.habitos.split(', ') : []
                    }))
                },
                metadatos: {
                    fechaGeneracionReporte: new Date().toISOString(),
                    tipoReporte: 'HISTORIAL_CLINICO_COMPLETO'
                }
            }
        };
        
        return NextResponse.json(reportData, { 
            status: 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

    } catch (error) {
        console.error('Error obteniendo historial clínico del paciente:', error);
        
        return NextResponse.json(
            { 
                success: false,
                message: 'Error interno del servidor al obtener el historial clínico',
                error: 'INTERNAL_SERVER_ERROR',
                details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
            },
            { status: 500 }
        );
    }
}