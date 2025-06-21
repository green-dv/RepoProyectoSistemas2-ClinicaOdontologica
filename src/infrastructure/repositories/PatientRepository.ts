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
        const baseParams: (string | number)[] = [];
        let whereClause = 'WHERE habilitado = true';

        if (searchQuery) {
            baseParams.push(`%${searchQuery.toLowerCase()}%`);
            whereClause += ` AND (LOWER(nombres) ILIKE $${baseParams.length} OR LOWER(apellidos) ILIKE $${baseParams.length})`;
        }

        const countResult = await this.db.query(
            `SELECT COUNT(*) FROM pacientes ${whereClause}`,
            baseParams
        );
        
        const queryParams = [...baseParams];
        
        queryParams.push(limit, offset);
        
        const result = await this.db.query(
            `SELECT * FROM pacientes ${whereClause} ORDER BY idpaciente DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
            queryParams
        );

        const totalCount = parseInt(countResult.rows[0].count);

        return {
            data: result.rows as Patient[],
            pagination: {
              page,
              limit,
              totalItems: totalCount,
              totalPages: Math.ceil(totalCount / limit)
            }
        };
    }
      
    async getPatientsDisabled(page: number, limit: number, searchQuery?: string): Promise<PatientResponse> {
        const offset = (page - 1) * limit;
        const baseParams: (string | number)[] = [];
        let whereClause = 'WHERE habilitado = false';

        if (searchQuery) {
            baseParams.push(`%${searchQuery.toLowerCase()}%`);
            whereClause += ` AND (LOWER(nombres) ILIKE $${baseParams.length} OR LOWER(apellidos) ILIKE $${baseParams.length})`;
        }

        const countResult = await this.db.query(
            `SELECT COUNT(*) FROM pacientes ${whereClause}`,
            baseParams
        );
        
        const queryParams = [...baseParams];
        
        queryParams.push(limit, offset);
        
        const result = await this.db.query(
            `SELECT * FROM pacientes ${whereClause} ORDER BY idpaciente DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
            queryParams
        );

        const totalCount = parseInt(countResult.rows[0].count);

        return {
            data: result.rows as Patient[],
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
        'SELECT * FROM pacientes WHERE idpaciente = $1 AND habilitado = true',
        [id]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0] as Patient;
    }

    async createPatient(patient: Patient): Promise<Patient> {
        const result = await this.db.query(
        `INSERT INTO pacientes 
        (nombres, apellidos, direccion, telefonodomicilio, telefonopersonal, 
        lugarnacimiento, fechanacimiento, sexo, estadocivil, ocupacion, 
        aseguradora, habilitado) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *`,
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
        `UPDATE pacientes SET 
            nombres = $1, 
            apellidos = $2, 
            direccion = $3, 
            telefonodomicilio = $4, 
            telefonopersonal = $5, 
            lugarnacimiento = $6, 
            fechanacimiento = $7, 
            sexo = $8, 
            estadocivil = $9, 
            ocupacion = $10, 
            aseguradora = $11, 
            habilitado = $12
        WHERE idpaciente = $13 AND habilitado = true 
        RETURNING *`,
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
            patient.habilitado ?? true,
            id
        ]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0] as Patient;
    }

    async deletePatient(id: number): Promise<boolean> {
        const result = await this.db.query(
            'UPDATE pacientes SET habilitado = false WHERE idpaciente = $1 AND habilitado = true',
            [id]
        );
        
        return result.rowCount !== null && result.rowCount > 0;
    }

    async restorePatient(id: number): Promise<boolean> {
        const result = await this.db.query(
            'UPDATE pacientes SET habilitado = true WHERE idpaciente = $1 AND habilitado = false',
            [id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    async deletePatientPermanently(id: number): Promise<boolean> {
        try {
            const result = await this.db.query(
                'DELETE FROM pacientes WHERE idpaciente = $1 AND habilitado = false',
                [id]
            );
            return result.rowCount !== null && result.rowCount > 0;
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
