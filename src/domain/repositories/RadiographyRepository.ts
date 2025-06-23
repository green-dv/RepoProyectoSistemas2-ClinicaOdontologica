import { Radiography, Detection } from "../entities/Radiography";

export interface IRadiographyRepository {
    create(radiography: Radiography): Promise<Radiography>;
    createDetection(detection: Detection, radiographyid: number): Promise<Detection>;
    getAll(): Promise<Radiography[]>;
    getByPatientId(patientid: number): Promise<Radiography[] | null>;
    getByRadiographyId(radiographyid: number): Promise<Radiography | null>;
    getDetectionsByRadiographyId(radiographyId: number): Promise<Detection[]>;
}