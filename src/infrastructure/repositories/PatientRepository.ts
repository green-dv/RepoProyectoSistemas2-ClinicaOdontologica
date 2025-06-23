import { Patient } from '@/domain/entities/Patient';
import { PatientClinicalRecord, ClinicalAntecedent, PatientClinicalRecordRow } from '@/domain/entities/Patient';
import {PatientResponse} from '@/domain/dto/patient';
import { PatientRepository } from '@/domain/repositories/PatientRepository';
import { getConnection } from '../db/db';

export class IPatientRepository implements PatientRepository {
    private db;

    constructor() {
        this.db = getConnection();
    }

    async getPatients(page: number, limit: number, searchQuery?: string): Promise<PatientResponse> {
        const offset = (page - 1) * limit;

        const allResult = await this.db.query(`SELECT * FROM get_all_pacientes()`);

        let filtered = allResult.rows;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.nombres?.toLowerCase().includes(query) ||
                p.apellidos?.toLowerCase().includes(query)
            );
        }

        const totalItems = filtered.length;
        const paginated = filtered.slice(offset, offset + limit);

        return {
            data: paginated,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        };
    }

      
    async getPatientsDisabled(page: number, limit: number, searchQuery?: string): Promise<PatientResponse> {
        const offset = (page - 1) * limit;

        const allResult = await this.db.query(`SELECT * FROM get_all_patients_disabled()`);

        let filtered = allResult.rows as Patient[];

        if (searchQuery) {
            const lowerSearch = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.nombres.toLowerCase().includes(lowerSearch) ||
                p.apellidos.toLowerCase().includes(lowerSearch)
            );
        }

        const totalCount = filtered.length;

        const paginated = filtered.slice(offset, offset + limit);

        return {
            data: paginated,
            pagination: {
                page,
                limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

      

    async getPatientById(id: number): Promise<Patient | null> {
        const result = await this.db.query(
        'SELECT * FROM get_all_pacientes() WHERE idpaciente = $1 AND habilitado = true',
        [id]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0] as Patient;
    }

    async createPatient(patient: Patient): Promise<Patient> {
        const result = await this.db.query(
            `SELECT * FROM createPatiente($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                patient.nombres,
                patient.apellidos,
                patient.direccion,
                patient.telefonodomicilio,
                patient.telefonopersonal,
                patient.lugarnacimiento,
                patient.fechanacimiento,
                patient.sexo,
                patient.estadocivil,
                patient.ocupacion,
                patient.aseguradora,
                patient.habilitado ?? true
            ]
        );

        return result.rows[0] as Patient;
    }


    async updatePatient(id: number, patient: Patient): Promise<Patient | null> {
        const result = await this.db.query(
            `SELECT * FROM update_paciente($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
                id,
                patient.nombres,
                patient.apellidos,
                patient.direccion,
                patient.telefonodomicilio,
                patient.telefonopersonal,
                patient.lugarnacimiento,
                patient.fechanacimiento,
                patient.sexo,
                patient.estadocivil,
                patient.ocupacion,
                patient.aseguradora,
                patient.habilitado ?? true
            ]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0] as Patient;
    }


    async deletePatient(id: number): Promise<boolean> {
        const result = await this.db.query(
            'SELECT disable_paciente($1) AS success',
            [id]
        );

        return result.rows[0]?.success === true;
    }


   async restorePatient(id: number): Promise<boolean> {
        const result = await this.db.query(
            'SELECT enable_paciente($1) AS success',
            [id]
        );

        return result.rows[0]?.success === true;
    }


    async deletePatientPermanently(id: number): Promise<boolean> {
        try {
            const result = await this.db.query(
                'SELECT delete_paciente_permanently($1) AS success',
                [id]
            );
            return result.rows[0]?.success === true;
        } catch (error) {
            console.error('Error permanently deleting patient:', error);
            throw error;
        }
    }

    async getPatientByClinicalRecordID(id: number): Promise<PatientClinicalRecord | null> {
        const result = await this.db.query(
            'SELECT * FROM get_clinical_record($1) WHERE habilitado = true',
            [id]
        );
        
        if (result.rows.length === 0) {
            return null;
        }

        const rows = result.rows as PatientClinicalRecordRow[];

        // Transformar las filas en el formato deseado
        return this.transformToClinicalRecord(rows);
    }
    
    private transformToClinicalRecord(rows: PatientClinicalRecordRow[]): PatientClinicalRecord {
        const firstRow = rows[0];
        
        const patientData = {
            idpaciente: firstRow.idpaciente,
            nombres: firstRow.nombres,
            apellidos: firstRow.apellidos,
            direccion: firstRow.direccion,
            telefonodomicilio: firstRow.telefonodomicilio,
            telefonopersonal: firstRow.telefonopersonal,
            lugarnacimiento: firstRow.lugarnacimiento,
            fechanacimiento: firstRow.fechanacimiento,
            sexo: firstRow.sexo,
            estadocivil: firstRow.estadocivil,
            ocupacion: firstRow.ocupacion,
            aseguradora: firstRow.aseguradora,
            habilitado: firstRow.habilitado
        };

        // Extraer y transformar los antecedentes
        const antecedentes: ClinicalAntecedent[] = rows.map(row => ({
            idantecedente: row.idantecedente,
            tiene_embarazo: row.tiene_embarazo,
            fecha_antecedente: row.fecha_antecedente,
            enfermedades: row.enfermedades || '',
            atenciones_medicas: row.atenciones_medicas || '',
            medicaciones: row.medicaciones || '',
            habitos: row.habitos || ''
        }));

        return {
            ...patientData,
            antecedentes
        };
    }
}
