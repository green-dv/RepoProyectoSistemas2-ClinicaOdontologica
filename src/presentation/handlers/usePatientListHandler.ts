import { useCallback } from 'react';
import { Patient } from '@/domain/entities/Patient';

interface UsePatientActionHandlersProps {
    onViewPatient: (patient: Patient) => void;
    onEditPatient: (patient: Patient) => void;
    onDeletePatient: (patient: Patient) => void;
    onRestorePatient?: (patient: Patient) => void;
    onDeletePermanently?: (patient: Patient) => void;
    onRefresh: () => void;
    onCreatePatient: () => void;
}

export const usePatientActionHandlers = ({
    onViewPatient,
    onEditPatient,
    onDeletePatient,
    onRestorePatient,
    onDeletePermanently,
    onRefresh,
    onCreatePatient,
}: UsePatientActionHandlersProps) => {
  
    const handleViewPatient = useCallback((patient: Patient) => {
        onViewPatient(patient);
    }, [onViewPatient]);

    const handleEditPatient = useCallback((patient: Patient) => {
        onEditPatient(patient);
    }, [onEditPatient]);

    const handleDeletePatient = useCallback((patient: Patient) => {
        onDeletePatient(patient);
    }, [onDeletePatient]);

    const handleRestorePatient = useCallback((patient: Patient) => {
        if (onRestorePatient) {
            onRestorePatient(patient);
        }
    }, [onRestorePatient]);

    const handleDeletePermanently = useCallback((patient: Patient) => {
        if (onDeletePermanently) {
            onDeletePermanently(patient);
        }
    }, [onDeletePermanently]);

    const handleRefresh = useCallback(() => {
        onRefresh();
    }, [onRefresh]);

    const handleCreatePatient = useCallback(() => {
        onCreatePatient();
    }, [onCreatePatient]);

    return {
        handleViewPatient,
        handleEditPatient,
        handleDeletePatient,
        handleRestorePatient,
        handleDeletePermanently,
        handleRefresh,
        handleCreatePatient,
    };
};