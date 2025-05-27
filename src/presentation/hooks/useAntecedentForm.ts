import { useState, useEffect } from 'react';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';

interface UseAntecedenteFormProps {
    antecedente?: AntecedenteCompleto | null;
    pacienteId?: number | null;
    mode: 'add' | 'view' | 'edit'; 
    open: boolean;
}

interface UseAntecedenteFormReturn {
    formData: AntecedenteCompleto;
    setFormData: React.Dispatch<React.SetStateAction<AntecedenteCompleto>>;
    formErrors: Record<string, string>;
    setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    currentMode: 'add' | 'view' | 'edit';
    setCurrentMode: React.Dispatch<React.SetStateAction<'add' | 'view' | 'edit'>>;
    isReadOnly: boolean;
    validateForm: () => boolean;
    resetForm: () => void;
}

const initialAntecedente: AntecedenteCompleto = {
    idpaciente: 0,
    embarazo: false,
    habilitado: true,
    fecha: new Date(),
    enfermedades: [],
    habitos: [],
    medicaciones: [],
    atencionesMedicas: []
};

export const useAntecedenteForm = ({
    antecedente,
    pacienteId,
    mode,
    open
}: UseAntecedenteFormProps): UseAntecedenteFormReturn => {
    const [formData, setFormData] = useState<AntecedenteCompleto>(initialAntecedente);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [currentMode, setCurrentMode] = useState<'add' | 'view' | 'edit'>(mode);

    useEffect(() => {
        if (open) {
            let newFormData: AntecedenteCompleto;
            
            if (antecedente && mode === 'edit') {
                newFormData = { 
                    ...antecedente,
                    enfermedades: antecedente.enfermedades || [],
                    habitos: antecedente.habitos || [],
                    medicaciones: antecedente.medicaciones || [],
                    atencionesMedicas: antecedente.atencionesMedicas || []
                };
                setCurrentMode('edit');
                console.log('Datos cargados para edición:', newFormData);
            } else if (antecedente && mode === 'view') {
                newFormData = { 
                    ...antecedente,
                    enfermedades: antecedente.enfermedades || [],
                    habitos: antecedente.habitos || [],
                    medicaciones: antecedente.medicaciones || [],
                    atencionesMedicas: antecedente.atencionesMedicas || []
                };
                setCurrentMode('view');
            } else {
                newFormData = { ...initialAntecedente };
                setCurrentMode('add');
                if (pacienteId) {
                    newFormData.idpaciente = pacienteId;
                }
            }
            
            setFormData(newFormData);
            setFormErrors({}); 
        }
    }, [antecedente, pacienteId, open, mode]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        
        if (!formData.idpaciente || formData.idpaciente <= 0) {
            errors.idpaciente = 'El ID del paciente es requerido';
        }
        
        if (!formData.fecha) {
            errors.fecha = 'La fecha es requerida';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = (): void => {
        setFormData(initialAntecedente);
        setFormErrors({});
        setCurrentMode('add');
    };

    const isReadOnly = currentMode === 'view';

    return {
        formData,
        setFormData,
        formErrors,
        setFormErrors,
        currentMode,
        setCurrentMode,
        isReadOnly,
        validateForm,
        resetForm
    };
};