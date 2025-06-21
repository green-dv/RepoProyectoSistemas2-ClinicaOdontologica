import { CreateConsultationDTO, ConsultationDetail, ConsultationByPatientDTO, UpdateConsultationDTO, ConsultationResponse } from "@/domain/dto/consultation";
import { Consultation } from "@/domain/entities/Consultations";
import { Treatment } from "@/domain/entities/Treatments";
import { ConsultationRepository } from "@/domain/repositories/ConsultationRepository";
import { getConnection } from "@/infrastructure/db/db";

export class IConsultationRepository implements ConsultationRepository {
    private db;

    constructor() {
        this.db = getConnection();
    }
    async createConsultation(consultation: CreateConsultationDTO): Promise<Consultation> {

        const result = await this.db.query( `
        INSERT INTO consultas (fecha, presupuesto, idpaciente, idusuario, estadopago, habilitado)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `, [
            consultation.fecha,
            consultation.presupuesto,
            consultation.idpaciente,
            consultation.idusuario,
            consultation.estadopago || false,
            true
        ]
        );
        const nuevaConsulta = result.rows[0] as Consultation;
        //para tratamientos solo si hay 
        if(consultation.tratamientos && consultation.tratamientos.length > 0) {

            await this.addTreatments(nuevaConsulta.idconsulta, consultation.tratamientos);
        }
        return {
            idconsulta: nuevaConsulta.idconsulta,
            fecha: nuevaConsulta.fecha,
            presupuesto: nuevaConsulta.presupuesto,
            idpaciente: nuevaConsulta.idpaciente,
            idusuario: nuevaConsulta.idusuario,
            estadopago: nuevaConsulta.estadopago,
            habilitado: nuevaConsulta.habilitado
        };
    }

    async findbyIdConsultation(id: number): Promise<Consultation | null> {
        const result = await this.db.query(
            `SELECT * FROM consultas WHERE idconsulta = $1 AND habilitado = true`,
            [id]
        );
        if (result.rows.length === 0) {
            return null;
        }
        const consulta = result.rows[0] as Consultation;
        return {
            idconsulta: consulta.idconsulta,
            fecha: consulta.fecha,
            presupuesto: consulta.presupuesto,
            idpaciente: consulta.idpaciente,
            idusuario: consulta.idusuario,
            estadopago: consulta.estadopago,
            habilitado: consulta.habilitado
        };
    }
    async findbyIdConsultationDetail(id: number): Promise<ConsultationDetail | null> {
        const result = await this.db.query(
        `
            SELECT 
                c.*,
                p.nombres, p.apellidos, p.direccion, p.telefonodomicilio, 
                p.telefonopersonal, p.lugarnacimiento, p.fechanacimiento, 
                p.sexo, p.estadocivil, p.ocupacion, p.aseguradora,
                p.habilitado as paciente_habilitado,
                u.nombre as usuario_nombre, u.apellido as usuario_apellido, 
                u.email, u.fecharegistro, u.cambiopassword, 
                u.habilitado as usuario_habilitado
            FROM consultas c
            INNER JOIN pacientes p ON c.idpaciente = p.idpaciente
            INNER JOIN usuarios u ON c.idusuario = u.idusuario
            WHERE c.idconsulta = $1 AND c.habilitado = true
        `, [id]);
        if (result.rows.length ===0){
            return null;
        }
        const row = result.rows[0];

        const treatments = await this.getTreatmentsByConsultationId(id);

        return{
            idconsulta: row.idconsulta,
            fecha: row.fecha,
            presupuesto: parseFloat(row.presupuesto),
            estadopago: row.estadopago,
            habilitado: row.habilitado,
            paciente: {
                idpaciente: row.idpaciente,
                nombres: row.nombres,
                apellidos: row.apellidos,
                direccion: row.direccion,
                telefonodomicilio: row.telefonodomicilio,
                telefonopersonal: row.telefonopersonal,
                lugarnacimiento: row.lugarnacimiento,
                fechanacimiento: row.fechanacimiento,
                sexo: row.sexo,
                estadocivil: row.estadocivil,
                ocupacion: row.ocupacion,
                aseguradora: row.aseguradora,
                habilitado: row.paciente_habilitado
            },
            usuario: {
                idusuario: row.idusuario,
                nombre: row.usuario_nombre,
                apellido: row.usuario_apellido,
                email: row.email,
                password: '', 
                fecharegistro: row.fecharegistro,
                cambiopassword: row.cambiopassword,
                habilitado: row.usuario_habilitado
            },
            tratamientos: await treatments
        };
    }

    async findConsultationsByPatientId(patientId: number): Promise<ConsultationByPatientDTO[]> {
        const result = await this.db.query(`
            SELECT 
                c.idconsulta, c.fecha, c.presupuesto, c.estadopago, c.habilitado,
                p.idpaciente, p.nombres, p.apellidos, p.telefonopersonal,
                u.idusuario, u.nombre, u.apellido
            FROM consultas c
            INNER JOIN pacientes p ON c.idpaciente = p.idpaciente
            INNER JOIN usuarios u ON c.idusuario = u.idusuario
            WHERE c.idpaciente = $1 AND c.habilitado = true
        `, [patientId]);

        return result.rows.map(row => ({
            idconsulta: row.idconsulta,
            fecha: row.fecha,
            presupuesto: parseFloat(row.presupuesto),
            estadopago: row.estadopago,
            habilitado: row.habilitado,
            paciente: {
                idpaciente: row.idpaciente,
                nombres: row.nombres,
                apellidos: row.apellidos,
                telefonopersonal: row.telefonopersonal
            },
            usuario: {
                idusuario: row.idusuario,
                nombre: row.nombre,
                apellido: row.apellido
            }
        }));
    }
    async updateConsultation(id: number, updateData: UpdateConsultationDTO): Promise<Consultation | null> {
        const updateFields: string[] = [];
        const params: unknown[] = []; 
        let paramIndex = 1;
         if (updateData.fecha !== undefined) {
                updateFields.push(`fecha = $${paramIndex}`);
                params.push(new Date(updateData.fecha).toISOString());
                paramIndex++;
        }
        if (updateData.presupuesto !== undefined) {
            updateFields.push(`presupuesto = $${paramIndex}`);
            params.push(updateData.presupuesto);
            paramIndex++;
        }

        if (updateData.estadopago !== undefined) {
            updateFields.push(`estadopago = $${paramIndex}`);
            params.push(updateData.estadopago);
            paramIndex++;
        }

        if(updateFields.length ===  0){
            await this.db.query(`ROLLBACK`);
            return null;
        }
        const result = await this.db.query(
        `
            UPDATE consultas
            SET
                ${updateFields.join(", ")}
            WHERE idconsulta = $${paramIndex}
            RETURNING *
        `,
        [...params, id]
        );


        if(result.rows.length === 0) {
            await this.db.query(`ROLLBACK`);
            return null;
        }   

        if(updateData.tratamientos != undefined) {
            await this.db.query(`DELETE FROM consultatratamientos WHERE idconsulta = $1`, [id]);
            //poner los nuevios
            if(updateData.tratamientos.length > 0){
                await this.addTreatments(id, updateData.tratamientos);
            }
        }

        await this.db.query(`COMMIT`);

        const row = result.rows[0];
        return{
            idconsulta: row.idconsulta,
            fecha: row.fecha,
            presupuesto: parseFloat(row.presupuesto),
            idpaciente: row.idpaciente,
            idusuario: row.idusuario,
            estadopago: row.estadopago,
            habilitado: row.habilitado
        };

    }
    //deshabilitar
    async deleteConsultation(id: number): Promise<boolean> {
        const result = await this.db.query(
            `
                UPDATE consultas
                SET habilitado = false
                WHERE idconsulta = $1 AND habilitado = true
            `,
            [id]
        );
        if (result.rowCount === 0) {
            throw new Error(`No se pudo eliminar la consulta con id ${id}`);
        }
        return result.rowCount !== null && result.rowCount > 0;
    }
    async addTreatments(idconsulta: number, tratamientos: number[]): Promise<void> {
        if(tratamientos.length === 0) {
            return;
        }
        //Crear tratamientos 
        const values = tratamientos.map((_, index) =>
            `($${index * 2 + 1}, $${index * 2 + 2})`
        ).join(', ');

        const params = tratamientos.flatMap(idtratamiento=> [idtratamiento, idconsulta]);

        const query = `
            INSERT INTO consultatratamientos (idtratamiento, idconsulta)
            VALUES ${values}
            ON CONFLICT (idtratamiento, idconsulta) DO NOTHING
        `;
        await this.db.query(query, params);
    }

    async removeTreatments(idconsulta: number, tratamientos: number[]): Promise<void> {
        if(tratamientos.length === 0) {
            return;
        }
        const placeholders = tratamientos.map((_, index) =>
            `$${index + 2}`
        ).join(', ');

        const params = tratamientos.map(idtratamiento => [idtratamiento, idconsulta]).flat();

        const query = `
            DELETE FROM consultatratamientos
            WHERE idconsulta = $1 AND idtratamiento IN (${placeholders})
        `;
        await this.db.query(query, params);
    }
    async getTreatmentsByConsultationId(idconsulta: number): Promise<Treatment[]> {
        const result = await this.db.query(
            `
                SELECT t.*
                FROM tratamientos t
                INNER JOIN consultatratamientos ct ON t.idtratamiento = ct.idtratamiento
                WHERE ct.idconsulta = $1 and t.habilitado = true
                ORDER BY t.nombre
            `,
            [idconsulta]
        );

        return result.rows.map(row => ({
            idtratamiento: row.idtratamiento,
            nombre: row.nombre,
            descripcion: row.descripcion,
            precio: parseFloat(row.precio),
            habilitado: row.habilitado
        }));
    }

    async getPaginatedConsultations(page: number, limit: number, searchQuery?: string): Promise<ConsultationResponse> {
        const offset = (page - 1) * limit;
        const baseParams: (string | number)[] = [];
        let whereClause = 'WHERE habilitado = true';

        if(searchQuery) {
            baseParams.push(`%${searchQuery.toLowerCase()}%`);
            whereClause += ` AND (fecha::text ILIKE $${baseParams.length} OR idpaciente::text ILIKE $${baseParams.length})`;
        }

        const countResult = await this.db.query(
            `SELECT COUNT(*) FROM consultas ${whereClause}`,
            baseParams
        );

        const queryParams = [...baseParams];
        queryParams.push(limit, offset);

        const result = await this.db.query(
            `SELECT * FROM consultas ${whereClause} ORDER BY idconsulta DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
            queryParams
        );

        const totalCount = parseInt(countResult.rows[0].count);

        return {
            data: result.rows.map(row => ({
                idconsulta: row.idconsulta,
                fecha: row.fecha,
                presupuesto: parseFloat(row.presupuesto),
                idpaciente: row.idpaciente,
                idusuario: row.idusuario,
                estadopago: row.estadopago,
                habilitado: row.habilitado
            })),
            pagination: {
                page,
                limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        }
    }

    async getConsultationsDisabled(page: number, limit: number, searchQuery?: string): Promise<ConsultationResponse> {
        const offset = (page - 1) * limit;
        const baseParams: (string | number)[] = [];
        let whereClause = 'WHERE habilitado = false';

        if(searchQuery) {
            baseParams.push(`%${searchQuery.toLowerCase()}%`);
            whereClause += ` AND (fecha::text ILIKE $${baseParams.length} OR idpaciente::text ILIKE $${baseParams.length})`;
        }

        const countResult = await this.db.query(
            `SELECT COUNT(*) FROM consultas ${whereClause}`,
            baseParams
        );

        const queryParams = [...baseParams];
        queryParams.push(limit, offset);

        const result = await this.db.query(
            `SELECT * FROM consultas ${whereClause} ORDER BY idconsulta DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
            queryParams
        );

        const totalCount = parseInt(countResult.rows[0].count);

        return {
            data: result.rows.map(row => ({
                idconsulta: row.idconsulta,
                fecha: row.fecha,
                presupuesto: parseFloat(row.presupuesto),
                idpaciente: row.idpaciente,
                idusuario: row.idusuario,
                estadopago: row.estadopago,
                habilitado: row.habilitado
            })),
            pagination: {
                page,
                limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        }
    }
}






