import { Antecedent, AntecedenteCompleto } from '../entities/Antecedent';
import { AntecedentResponse } from '../dto/antecedent';
import { Illness } from '../entities/Illnesses';
import { Habit } from '../entities/Habits';
import { MedicalAttention } from '../entities/MedicalAttentions';
import { Medication } from '../entities/Medications';

export interface AntecedenteRepository {
    getAntecedentes(page: number, limit: number): Promise<AntecedentResponse>;
    getAntecedentesByPatientId(patientId: number): Promise<AntecedentResponse>;
    getAntecedenteById(id: number): Promise<AntecedenteCompleto | null>;
    createAntecedente(antecedente: AntecedenteCompleto): Promise<Antecedent>;
    updateAntecedente(id: number, antecedente: AntecedenteCompleto): Promise<Antecedent | null>;
    deleteAntecedente(id: number): Promise<boolean>;
    
    getEnfermedadesByAntecedenteId(antecedenteId: number): Promise<Illness[]>;
    addEnfermedad(antecedenteId: number, enfermedadId: number): Promise<boolean>;
    removeEnfermedad(antecedenteId: number, enfermedadId: number): Promise<boolean>;
    
    getHabitosByAntecedenteId(antecedenteId: number): Promise<Habit[]>;
    addHabito(antecedenteId: number, habitoId: number): Promise<boolean>;
    removeHabito(antecedenteId: number, habitoId: number): Promise<boolean>;
    
    getMedicacionesByAntecedenteId(antecedenteId: number): Promise<Medication[]>;
    addMedicacion(antecedenteId: number, medicacionId: number): Promise<boolean>;
    removeMedicacion(antecedenteId: number, medicacionId: number): Promise<boolean>;
    
    getAtencionMedicasByAntecedenteId(antecedenteId: number): Promise<MedicalAttention[]>;
    addAtencionMedica(antecedenteId: number, atencionMedicaId: number): Promise<boolean>;
    removeAtencionMedica(antecedenteId: number, atencionMedicaId: number): Promise<boolean>;
}