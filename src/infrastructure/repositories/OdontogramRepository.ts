import { Odontogram, CreateOdontogram } from "@/domain/entities/Odontogram"
import { Diagnosis } from "@/domain/entities/Diagnosis"
import { OdontogramDescription, OdontogramDescriptionDTO } from "@/domain/entities/OdontogramDescription"
import { getConnection } from '../db/db';
import { OdontogramaRepository } from "@/domain/repositories/OdontogramaRepository";


export class IOdontogramrepository implements OdontogramaRepository {
    private readonly db;
    
    constructor() {
        this.db = getConnection();
    }

    async getOdontograms(page: number, limit: number, idpaciente: number, searchQuery?: string): Promise<Odontogram[] | null> {
    const offset = (page - 1) * limit;

    let whereClause = `WHERE o.idpaciente = $1`;
    const values: (number | string)[] = [idpaciente];

    if (searchQuery) {
      whereClause += ` AND o.fechacreacion > $2`;
      values.push(searchQuery); 
    }

    const odontogramQuery = `
      SELECT
        o.idodontograma,
        o.idpaciente,
        concat(p.nombres, ' ', p.apellidos) as paciente,
        o.idconsulta,
        o.fechacreacion,
        o.observaciones
      FROM pacientes p 
      JOIN odontogramas o ON p.idpaciente = o.idpaciente
      ${whereClause}
      ORDER BY o.fechacreacion DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const result = await this.db.query(odontogramQuery, values);
    if (result.rows.length === 0) {
      return null;
    }
    
    const odontogramas = result.rows as Odontogram[];
    // para la descripcion
    for(const odontogram of odontogramas){
      odontogram.descripciones = await this.getDescriptions(odontogram.idodontograma);
    }
    return odontogramas;
  }
  
  async getOdontogramByConsultationId(consultationId: number): Promise<Odontogram | null> {

    const whereClause = `WHERE o.idconsulta = $1`;
    const values: (number | string)[] = [consultationId];


    const odontogramQuery = `
      SELECT
        o.idodontograma,
        o.idpaciente,
        concat(p.nombres, ' ', p.apellidos) as paciente,
        o.idconsulta,
        o.fechacreacion,
        o.observaciones
      FROM pacientes p 
      JOIN odontogramas o ON p.idpaciente = o.idpaciente
      JOIN consultas c ON c.idconsulta = o.idconsulta
      ${whereClause}
      ORDER BY o.idodontograma DESC
      LIMIT 1;
    `;

    const result = await this.db.query(odontogramQuery, values);
    if (result.rows.length === 0) {
      return null;
    }
    
    const odontogram = result.rows[0] as Odontogram;
    // para la descripcion
    odontogram.descripciones = await this.getDescriptions(odontogram.idodontograma);
    return odontogram;
  }
  
  async getDescriptions(idOdontograma: number): Promise<OdontogramDescription[]>{
    const result = await this.db.query( `
      SELECT
        descod.idcara,
        car.nombre as cara,
        np.codigofdi,
        np.nombre as nombrepieza,
        descod.iddiagnostico,
        d.descripcion as diagnostico,
        d.enlaceicono as enlaceicono,
        descod.idodontograma
      FROM descripcionodontogramas descod
      JOIN diagnosticos d ON descod.iddiagnostico = d.id
      JOIN npiezas np ON np.id = descod.idpieza
      JOIN caras car ON car.id = descod.idcara
      WHERE descod.idodontograma = $1
      `,[idOdontograma]
    );
    return result.rows as OdontogramDescription[];
    
  }
  async createOdontogram (odontogramito: CreateOdontogram): Promise<Odontogram>{
    const result = await this.db.query(
      `
        INSERT INTO odontogramas (idpaciente,idconsulta,fechacreacion,observaciones)
        VALUES ($1,$2,$3,$4)
        RETURNING idodontograma, idpaciente, idconsulta, fechacreacion, observaciones
      `,[
        odontogramito.idpaciente,
        odontogramito.idconsulta,
        odontogramito.fechacreacion,
        odontogramito.observaciones ?? ''
      ]);
    const newOdontogram = result.rows[0];
    const patientResult = await this.db.query(
      ` SELECT CONCAT(nombres, ' ', apellidos) as paciente
      FROM pacientes
      WHERE idpaciente = $1
    `, [newOdontogram.idpaciente]);
 
    return {
      ...newOdontogram,
      patient: patientResult.rows[0]?.patient ?? '',
      descripciones: []
    } as Odontogram;
  }

  async addDescription(descripcion: OdontogramDescriptionDTO): Promise<OdontogramDescriptionDTO | null>{
    try{
      console.log('imprimiendo la descripcion desde el repository');
      console.log(descripcion);
      const result = await this.db.query(
        `
          INSERT INTO descripcionodontogramas (idcara, idpieza, iddiagnostico, idodontograma)
          VALUES($1, $2, $3, (select MAX(idodontograma) from odontogramas))
          RETURNING idcara, idpieza, iddiagnostico, idodontograma
        `, [
          descripcion.idcara,
          descripcion.idpieza,
          descripcion.iddiagnostico
          ]
      );
      if(result.rows.length === 0) return null;
  
      const description = result.rows[0] as OdontogramDescriptionDTO;
      return description;
    }
    catch (error) {
      console.error('Error al agregar la descripción:', error);
      throw new Error('Error al agregar la descripción');
    }
    
  }

  async getLastOdontogramPerPatientId(patientId: number): Promise<Odontogram | null>{
    const whereClause = `WHERE o.idpaciente = $1`;
    const values: (number | string)[] = [patientId];


    const odontogramQuery = `
      SELECT
        o.idodontograma,
        o.idpaciente,
        concat(p.nombres, ' ', p.apellidos) as paciente,
        o.idconsulta,
        o.fechacreacion,
        o.observaciones
      FROM pacientes p 
      JOIN odontogramas o ON p.idpaciente = o.idpaciente
      ${whereClause}
      ORDER BY o.idodontograma DESC
      LIMIT 1;
    `;

    const result = await this.db.query(odontogramQuery, values);
    if (result.rows.length === 0) {
      return null;
    }
    
    const odontogram = result.rows[0] as Odontogram;
    // para la descripcion
    odontogram.descripciones = await this.getDescriptions(odontogram.idodontograma);
    return odontogram;
  }

  async removeDescription(idOdontograma: number,idCara: number, idPieza: number,  iddiagnostico: number): Promise<OdontogramDescription | null>{
    try{
      const result = await this.db.query(
        `
          DELETE FROM descripctionodontogramas 
          WHERE idcara = $1 AND idpieza = $2 AND iddiagnostico = $3 AND idodontograma = $4
          RETURNING *;
        `,
        [idCara, idPieza, iddiagnostico, idOdontograma]
      );
      if(result.rows.length === 0) return null;
      const description = result.rows[0] as OdontogramDescription;
      return description;
    } catch{
      throw new Error('Error al eliminar');
    }
    
  }
  async getDiagnosis(): Promise<Diagnosis[] | null> {
    try{
      const result = await this.db.query(
        `
          SELECT id AS iddiagnostico, descripcion, enlaceicono FROM diagnosticos
        `
      );
      if(result.rows.length === 0) return null;
      const diagnosis = result.rows as Diagnosis[];
      return diagnosis
    } catch{
      throw new Error('Error al eliminar');
    }
  }

  async createDiagnosis(diagnosis: Diagnosis): Promise<Diagnosis | null> {
    try{

      const result = await this.db.query(
        `
          INSERT INTO diagnosticos (descripcion, enlaceicono)
          VALUES($1, $2)
          RETURNING id, descripcion, enlaceicono
        `, [
          diagnosis.descripcion,
          diagnosis.enlaceicono
          ]
      );
      if(result.rows.length === 0) return null;
  
      const createdDiagnosis = result.rows[0] as Diagnosis;
      return createdDiagnosis;
    }
    catch (error) {
      console.error('Error al crear el diagnostico:', error);
      throw new Error('Error al crear el diagnostico');
    }
  }
  async updateDiagnosis(diagnosis: Diagnosis): Promise<Diagnosis | null> {
    try{

      const result = await this.db.query(
        `
          UPDATE diagnosticos SET descripcion = $2, enlaceicono = $3)
          where id = $1
          RETURNING id, descripcion, enlaceicono
        `, [
          diagnosis.iddiagnostico,
          diagnosis.descripcion,
          diagnosis.enlaceicono
          ]
      );
      if(result.rows.length === 0) return null;
  
      const createdDiagnosis = result.rows[0] as Diagnosis;
      return createdDiagnosis;
    }
    catch (error) {
      console.error('Error al crear el diagnostico:', error);
      throw new Error('Error al crear el diagnostico');
    }
  }
}