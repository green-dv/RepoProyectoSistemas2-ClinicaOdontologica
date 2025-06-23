
import { Antecedent, AntecedenteCompleto } from '@/domain/entities/Antecedent';
import { AntecedentResponse } from '@/domain/dto/antecedent';
import { AntecedenteRepository } from '@/domain/repositories/AntecedentRepository';
import { getConnection } from '../db/db';
import { Illness } from '@/domain/entities/Illnesses';
import { Habit } from '@/domain/entities/Habits';
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';
import { Medication } from '@/domain/entities/Medications';

export class IAntecedenteRepository implements AntecedenteRepository {
    private db;

    constructor() {
        this.db = getConnection();
    }

    async getAntecedentes(page: number, limit: number): Promise<AntecedentResponse> {
        const offset = (page - 1) * limit;
        
        const countResult = await this.db.query(
        'SELECT COUNT(*) FROM antecedentes WHERE habilitado = true'
        );
        const totalCount = parseInt(countResult.rows[0].count);
        
        
        const result = await this.db.query(
        'SELECT * FROM antecedentes WHERE habilitado = true ORDER BY idantecedente LIMIT $1 OFFSET $2',
        [limit, offset]
        );
        
        return {
        data: result.rows as Antecedent[],
        pagination: {
            page,
            limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
        };
    }

    async getAntecedentesByPatientId(patientId: number): Promise<AntecedentResponse> {
        const result = await this.db.query(
        'SELECT * FROM antecedentes WHERE idpaciente = $1 AND habilitado = true ORDER BY idantecedente',
        [patientId]
        );
        
        return {
        data: result.rows as Antecedent[],
        pagination: {
            page: 1,
            limit: result.rows.length,
            totalItems: result.rows.length,
            totalPages: 1
        }
        };
    }

    async getAntecedenteById(id: number): Promise<AntecedenteCompleto | null> {
        const antecedenteResult = await this.db.query(
        'SELECT * FROM antecedentes WHERE idantecedente = $1 AND habilitado = true',
        [id]
        );
        
        if (antecedenteResult.rows.length === 0) {
        return null;
        }
        
        const antecedente = antecedenteResult.rows[0] as Antecedent;
        
        const enfermedadesResult = await this.db.query(
        'SELECT idenfermedad FROM antecedenteenfermedad WHERE idantecedente = $1',
        [id]
        );
        const enfermedades = enfermedadesResult.rows.map(row => row.idenfermedad);
        
        const habitosResult = await this.db.query(
        'SELECT idhabito FROM antecedentehabito WHERE idantecedente = $1',
        [id]
        );
        const habitos = habitosResult.rows.map(row => row.idhabito);
        
        const medicacionesResult = await this.db.query(
        'SELECT idmedicacion FROM antecedentemedicacion WHERE idantecedente = $1',
        [id]
        );
        const medicaciones = medicacionesResult.rows.map(row => row.idmedicacion);
        
        const atencionesResult = await this.db.query(
        'SELECT idatencionmedica FROM antecedenteatencionmedica WHERE idantecedente = $1',
        [id]
        );
        const atencionesMedicas = atencionesResult.rows.map(row => row.idatencionmedica);
        
        return {
        ...antecedente,
        enfermedades,
        habitos,
        medicaciones,
        atencionesMedicas
        };
    }

    async createAntecedente(antecedente: AntecedenteCompleto): Promise<Antecedent> {
    
        const client = await this.db.connect();
        
        try {
        await client.query('BEGIN');
        
        const antecedenteResult = await client.query(
            `INSERT INTO antecedentes (idpaciente, embarazo, habilitado, fecha) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [
            antecedente.idpaciente,
            antecedente.embarazo,
            antecedente.habilitado ?? true,
            antecedente.fecha
            ]
        );
        
        const createdAntecedente = antecedenteResult.rows[0] as Antecedent;
        const antecedenteId = createdAntecedente.idantecedente;
        
        if (antecedente.enfermedades && antecedente.enfermedades.length > 0) {
            for (const enfermedadId of antecedente.enfermedades) {
            await client.query(
                'INSERT INTO antecedenteenfermedad (idantecedente, idenfermedad) VALUES ($1, $2)',
                [antecedenteId, enfermedadId]
            );
            }
        }
        
        if (antecedente.habitos && antecedente.habitos.length > 0) {
            for (const habitoId of antecedente.habitos) {
            await client.query(
                'INSERT INTO antecedentehabito (idantecedente, idhabito) VALUES ($1, $2)',
                [antecedenteId, habitoId]
            );
            }
        }
        
        if (antecedente.medicaciones && antecedente.medicaciones.length > 0) {
            for (const medicacionId of antecedente.medicaciones) {
            await client.query(
                'INSERT INTO antecedentemedicacion (idantecedente, idmedicacion) VALUES ($1, $2)',
                [antecedenteId, medicacionId]
            );
            }
        }

        if (antecedente.atencionesMedicas && antecedente.atencionesMedicas.length > 0) {
            for (const atencionId of antecedente.atencionesMedicas) {
            await client.query(
                'INSERT INTO antecedenteatencionmedica (idantecedente, idatencionmedica) VALUES ($1, $2)',
                [antecedenteId, atencionId]
            );
            }
        }
        
        await client.query('COMMIT');
        return createdAntecedente;
        } catch (error) {
        await client.query('ROLLBACK');
        throw error;
        } finally {
        client.release();
        }
    }

    async updateAntecedente(id: number, antecedente: AntecedenteCompleto): Promise<Antecedent | null> {
        const client = await this.db.connect();
        
        try {
        await client.query('BEGIN');
        
        const antecedenteResult = await client.query(
            `UPDATE antecedentes SET 
            idpaciente = $1, 
            embarazo = $2, 
            habilitado = $3,
            fecha = $4
            WHERE idantecedente = $5 AND habilitado = true
            RETURNING *`,
            [
            antecedente.idpaciente,
            antecedente.embarazo,
            antecedente.habilitado ?? true,
            antecedente.fecha,
            id
            ]
        );
        
        if (antecedenteResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }
        
        const updatedAntecedente = antecedenteResult.rows[0] as Antecedent;
        
        await client.query('DELETE FROM antecedenteenfermedad WHERE idantecedente = $1', [id]);
        await client.query('DELETE FROM antecedentehabito WHERE idantecedente = $1', [id]);
        await client.query('DELETE FROM antecedentemedicacion WHERE idantecedente = $1', [id]);
        await client.query('DELETE FROM antecedenteatencionmedica WHERE idantecedente = $1', [id]);
        
        if (antecedente.enfermedades && antecedente.enfermedades.length > 0) {
            for (const enfermedadId of antecedente.enfermedades) {
            await client.query(
                'INSERT INTO antecedenteenfermedad (idantecedente, idenfermedad) VALUES ($1, $2)',
                [id, enfermedadId]
            );
            }
        }
        
        if (antecedente.habitos && antecedente.habitos.length > 0) {
            for (const habitoId of antecedente.habitos) {
            await client.query(
                'INSERT INTO antecedentehabito (idantecedente, idhabito) VALUES ($1, $2)',
                [id, habitoId]
            );
            }
        }
        
        if (antecedente.medicaciones && antecedente.medicaciones.length > 0) {
            for (const medicacionId of antecedente.medicaciones) {
            await client.query(
                'INSERT INTO antecedentemedicacion (idantecedente, idmedicacion) VALUES ($1, $2)',
                [id, medicacionId]
            );
            }
        }
        
        if (antecedente.atencionesMedicas && antecedente.atencionesMedicas.length > 0) {
            for (const atencionId of antecedente.atencionesMedicas) {
            await client.query(
                'INSERT INTO antecedenteatencionmedica (idantecedente, idatencionmedica) VALUES ($1, $2)',
                [id, atencionId]
            );
            }
        }
        
        await client.query('COMMIT');
        return updatedAntecedente;
        } catch (error) {
        await client.query('ROLLBACK');
        throw error;
        } finally {
        client.release();
        }
    }

    async deleteAntecedente(id: number): Promise<boolean> {
        const result = await this.db.query(
        'UPDATE antecedentes SET habilitado = false WHERE idantecedente = $1 AND habilitado = true',
        [id]
        );
        
        return result.rowCount !== null && result.rowCount > 0;
    }

    async getEnfermedadesByAntecedenteId(antecedenteId: number): Promise<Illness[]> {
        try {
          const result = await this.db.query(
            `
            SELECT e.idenfermedad, e.enfermedad, e.habilitado
            FROM antecedenteenfermedad ae
            JOIN enfermedades e ON ae.idenfermedad = e.idenfermedad
            WHERE ae.idantecedente = $1 AND e.habilitado = TRUE
            `,
            [antecedenteId]
          );
      
          return result.rows.map((row: Illness) => ({
            idenfermedad: row.idenfermedad,
            enfermedad: row.enfermedad,
            habilitado: row.habilitado
          }));
        } catch (error) {
          console.error('Error al obtener enfermedades por antecedente:', error);
          throw error;
        }
    }

    async addEnfermedad(antecedenteId: number, enfermedadId: number): Promise<boolean> {
        try {
        await this.db.query(
            'INSERT INTO antecedenteenfermedad (idantecedente, idenfermedad) VALUES ($1, $2)',
            [antecedenteId, enfermedadId]
        );
        return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async removeEnfermedad(antecedenteId: number, enfermedadId: number): Promise<boolean> {
        const result = await this.db.query(
        'DELETE FROM antecedenteenfermedad WHERE idantecedente = $1 AND idenfermedad = $2',
        [antecedenteId, enfermedadId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    async getHabitosByAntecedenteId(antecedenteId: number): Promise<Habit[]> {
        try {
            const result = await this.db.query<Habit>(
                `
                SELECT h.idhabito, h.habito, h.habilitado
                FROM antecedentehabito ah
                JOIN habitos h ON ah.idhabito = h.idhabito
                WHERE ah.idantecedente = $1 AND h.habilitado = TRUE
                `,
                [antecedenteId]
            );
        
            return result.rows.map(row => ({
                idhabito: row.idhabito,
                habito: row.habito,
                habilitado: row.habilitado
            }));
        } catch (error) {
            console.error('Error al obtener hábitos por antecedente:', error);
            throw error;
        }
    }

    async addHabito(antecedenteId: number, habitoId: number): Promise<boolean> {
        try {
        await this.db.query(
            'INSERT INTO antecedentehabito (idantecedente, idhabito) VALUES ($1, $2)',
            [antecedenteId, habitoId]
        );
        return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    async removeHabito(antecedenteId: number, habitoId: number): Promise<boolean> {
        const result = await this.db.query(
        'DELETE FROM antecedentehabito WHERE idantecedente = $1 AND idhabito = $2',
        [antecedenteId, habitoId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    async getMedicacionesByAntecedenteId(antecedenteId: number): Promise<Medication[]> {
        try {
            const result = await this.db.query<Medication>(
                `
                SELECT m.idmedicacion, m.medicacion, m.habilitado
                FROM antecedentemedicacion am
                JOIN medicaciones m ON am.idmedicacion = m.idmedicacion
                WHERE am.idantecedente = $1 AND m.habilitado = TRUE
                `,
                [antecedenteId]
            );
        
            return result.rows.map(row => ({
                idmedicacion: row.idmedicacion,
                medicacion: row.medicacion,
                habilitado: row.habilitado
            }));
        } catch (error) {
            console.error('Error al obtener medicaciones por antecedente:', error);
            throw error;
        }
    }

    async addMedicacion(antecedenteId: number, medicacionId: number): Promise<boolean> {
        try {
        await this.db.query(
            'INSERT INTO antecedentemedicacion (idantecedente, idmedicacion) VALUES ($1, $2)',
            [antecedenteId, medicacionId]
        );
        return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async removeMedicacion(antecedenteId: number, medicacionId: number): Promise<boolean> {
        const result = await this.db.query(
        'DELETE FROM antecedentemedicacion WHERE idantecedente = $1 AND idmedicacion = $2',
        [antecedenteId, medicacionId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    async getAtencionMedicasByAntecedenteId(antecedenteId: number): Promise<MedicalAttention[]> {
        try {
            const result = await this.db.query<MedicalAttention>(
                `
                SELECT a.idatencionmedica, a.atencion, a.habilitado
                FROM antecedenteatencionmedica aa
                JOIN atencionesmedicas a ON aa.idatencionmedica = a.idatencionmedica
                WHERE aa.idantecedente = $1 AND a.habilitado = TRUE
                `,
                [antecedenteId]
            );
        
            return result.rows.map(row => ({
                idatencionmedica: row.idatencionmedica,
                atencion: row.atencion,
                habilitado: row.habilitado
            }));
        } catch (error) {
            console.error('Error al obtener atenciones médicas por antecedente:', error);
            throw error;
        }
    }

    async addAtencionMedica(antecedenteId: number, atencionMedicaId: number): Promise<boolean> {
        try {
        await this.db.query(
            'INSERT INTO antecedenteatencionmedica (idantecedente, idatencionmedica) VALUES ($1, $2)',
            [antecedenteId, atencionMedicaId]
        );
        return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async removeAtencionMedica(antecedenteId: number, atencionMedicaId: number): Promise<boolean> {
        const result = await this.db.query(
        'DELETE FROM antecedenteatencionmedica WHERE idantecedente = $1 AND idatencionmedica = $2',
        [antecedenteId, atencionMedicaId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }
    
}