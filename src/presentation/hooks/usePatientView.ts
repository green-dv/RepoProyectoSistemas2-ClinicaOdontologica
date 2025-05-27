import { useState, useEffect } from 'react';
import { Patient } from '@/domain/entities/Patient';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';
import { Illness } from '@/domain/entities/Illnesses';
import { Habit } from '@/domain/entities/Habits';
import { Medication } from '@/domain/entities/Medications';
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';

export interface UsePatientViewHookResult {
    antecedentes: AntecedenteCompleto[];
    showAntecedentes: boolean;
    loadingAntecedentes: boolean;
    loadingError: string | null;
    tabValue: number;
    currentAntecedente: AntecedenteCompleto | null;
    
    enfermedades: Illness[];
    habitos: Habit[];
    medicaciones: Medication[];
    atencionesMedicas: MedicalAttention[];
    currentPatientId: number | null;
    loadingRelatedData: boolean;
    
    openAddAntecedenteDialog: boolean;
    openEditAntecedenteDialog: boolean;
    selectedAntecedente: AntecedenteCompleto | null;
    // Setters
    setTabValue: React.Dispatch<React.SetStateAction<number>>;
    setCurrentAntecedente: React.Dispatch<React.SetStateAction<AntecedenteCompleto | null>>;
    setAntecedentes: React.Dispatch<React.SetStateAction<AntecedenteCompleto[]>>;
    setShowAntecedentes: React.Dispatch<React.SetStateAction<boolean>>;
    setLoadingAntecedentes: React.Dispatch<React.SetStateAction<boolean>>;
    setLoadingError: React.Dispatch<React.SetStateAction<string | null>>;
    setEnfermedades: React.Dispatch<React.SetStateAction<Illness[]>>;
    setHabitos: React.Dispatch<React.SetStateAction<Habit[]>>;
    setMedicaciones: React.Dispatch<React.SetStateAction<Medication[]>>;
    setAtencionesMedicas: React.Dispatch<React.SetStateAction<MedicalAttention[]>>;
    setCurrentPatientId: React.Dispatch<React.SetStateAction<number | null>>;
    setLoadingRelatedData: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenAddAntecedenteDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenEditAntecedenteDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedAntecedente: React.Dispatch<React.SetStateAction<AntecedenteCompleto | null>>;

    //para resetear forms
    resetPatientViewState: () => void;
}

export const usePatientView = (patient: Patient | null): UsePatientViewHookResult => {
    // Estados principales
    const [antecedentes, setAntecedentes] = useState<AntecedenteCompleto[]>([]);
    const [showAntecedentes, setShowAntecedentes] = useState<boolean>(false);
    const [loadingAntecedentes, setLoadingAntecedentes] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState<number>(0);
    const [currentAntecedente, setCurrentAntecedente] = useState<AntecedenteCompleto | null>(null);
    
    // Estados para los datos relacionados
    const [enfermedades, setEnfermedades] = useState<Illness[]>([]);
    const [habitos, setHabitos] = useState<Habit[]>([]);
    const [medicaciones, setMedicaciones] = useState<Medication[]>([]);
    const [atencionesMedicas, setAtencionesMedicas] = useState<MedicalAttention[]>([]);
    const [currentPatientId, setCurrentPatientId] = useState<number | null>(null);
    const [loadingRelatedData, setLoadingRelatedData] = useState<boolean>(false);
    
    // Estados para controlar los diálogos
    const [openAddAntecedenteDialog, setOpenAddAntecedenteDialog] = useState<boolean>(false);
    const [openEditAntecedenteDialog, setOpenEditAntecedenteDialog] = useState<boolean>(false);
    const [selectedAntecedente, setSelectedAntecedente] = useState<AntecedenteCompleto | null>(null);

    const resetPatientViewState = () => {
        setAntecedentes([]);
        setShowAntecedentes(false);
        setLoadingAntecedentes(false);
        setLoadingError(null);
        setTabValue(0);
        setCurrentAntecedente(null);
        setEnfermedades([]);
        setHabitos([]);
        setMedicaciones([]);
        setAtencionesMedicas([]);
        setOpenAddAntecedenteDialog(false);
        setOpenEditAntecedenteDialog(false);
        setSelectedAntecedente(null);
    };

  
    useEffect(() => {
        resetPatientViewState();
        
        if (patient?.idpaciente) {
          setCurrentPatientId(patient.idpaciente);
        } else {
          setCurrentPatientId(null);
        }
    }, [patient]);

    return {
        antecedentes,
        showAntecedentes,
        loadingAntecedentes,
        loadingError,
        tabValue,
        currentAntecedente,
        
        enfermedades,
        habitos,
        medicaciones,
        atencionesMedicas,
        currentPatientId,
        loadingRelatedData,
        
        openAddAntecedenteDialog,
        openEditAntecedenteDialog,
        selectedAntecedente,
        
        // Setters
        setTabValue,
        setCurrentAntecedente,
        setAntecedentes,
        setShowAntecedentes,
        setLoadingAntecedentes,
        setLoadingError,
        setEnfermedades,
        setHabitos,
        setMedicaciones,
        setAtencionesMedicas,
        setCurrentPatientId,
        setLoadingRelatedData,
        setOpenAddAntecedenteDialog,
        setOpenEditAntecedenteDialog,
        setSelectedAntecedente,

        resetPatientViewState
    };
};