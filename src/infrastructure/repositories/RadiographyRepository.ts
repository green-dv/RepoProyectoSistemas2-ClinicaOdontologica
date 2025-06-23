
import { IRadiographyRepository } from "@/domain/repositories/RadiographyRepository";
import { Radiography, Detection } from "@/domain/entities/Radiography";
import { getConnection } from '../db/db';

export class RadiographyRepository implements IRadiographyRepository {
    private db;

    constructor() {
        this.db = getConnection();
    }

    async create(radiography: Radiography): Promise<Radiography> {
      const query = `
          INSERT INTO radiografias (enlaceradiografia, fechasubida, idpaciente)
          VALUES ($1, $2, $3)
          RETURNING *
      `;

      const values = [
          radiography.enlaceradiografia,
          radiography.fechasubida,
          radiography.idpaciente,
      ];

      const result = await this.db.query(query, values);
      const createdRadiography = result.rows[0] as Radiography;

      if (radiography.detecciones && radiography.detecciones.length > 0) {
          const deteccionesInsertadas: Detection[] = [];

          for (const detection of radiography.detecciones) {
              const inserted = await this.createDetection(detection, createdRadiography.idradiografia);
              deteccionesInsertadas.push(inserted);
          }

          createdRadiography.detecciones = deteccionesInsertadas;
      } else {
          createdRadiography.detecciones = [];
      }

      return createdRadiography;
  }

    async createDetection(detection: Detection, radiographyId: number): Promise<Detection> {
      const query = `
          INSERT INTO detecciones (idproblema, idradiografia, confianza, x1, y1, x2, y2)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
      `;

      const values = [
          detection.idproblema,
          radiographyId,
          detection.confianza,
          detection.x1,
          detection.y1,
          detection.x2,
          detection.y2,
      ];

      const result = await this.db.query(query, values);
      const insertedDetection = result.rows[0] as Detection;

      if (!insertedDetection.problema) {
          const probResult = await this.db.query(
              `SELECT nombre FROM problemas WHERE idproblema = $1`,
              [insertedDetection.idproblema]
          );
          insertedDetection.problema = probResult.rows[0]?.nombre || '';
      }

      return insertedDetection;
    }

    async getAll(): Promise<Radiography[]> {
      const query = `SELECT * FROM radiografias`;
      const result = await this.db.query(query);

      const radiografias: Radiography[] = [];

      for (const row of result.rows) {
          const detecciones = await this.getDetectionsByRadiographyId(row.idradiografia);
          radiografias.push({
              ...row,
              detecciones: detecciones
          });
      }

      return radiografias;
    }

    async getByPatientId(patientid: number): Promise<Radiography[] | null> {
      const query = `SELECT * FROM radiografias WHERE idpaciente = $1`;
      const result = await this.db.query(query, [patientid]);

      if (result.rows.length === 0) return null;

      const radiografias: Radiography[] = [];

      for (const row of result.rows) {
          const detecciones = await this.getDetectionsByRadiographyId(row.idradiografia);
          radiografias.push({
              ...row,
              detecciones: detecciones
          });
      }

      return radiografias;
    }

    async getByRadiographyId(radiographyid: number): Promise<Radiography[]> {
      const query = `SELECT * FROM radiografias WHERE idradiografia = $1`;
      const result = await this.db.query(query, [radiographyid]);

      const radiografias: Radiography[] = [];

      for (const row of result.rows) {
          const detecciones = await this.getDetectionsByRadiographyId(row.idradiografia);
          radiografias.push({
              ...row,
              detecciones: detecciones
          });
      }

      return radiografias;
    }

    async getDetectionsByRadiographyId(radiographyId: number): Promise<Detection[]> {
      const query = `
          SELECT d.*, p.nombre AS problema
          FROM detecciones d
          JOIN problemas p ON d.idproblema = p.idproblema
          WHERE d.idradiografia = $1
      `;

      const result = await this.db.query(query, [radiographyId]);
      return result.rows as Detection[];
    }
}