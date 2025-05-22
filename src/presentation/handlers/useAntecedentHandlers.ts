import React from 'react';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';
import { Option } from '@/presentation/hooks/useAntecedentsOptions';

interface HandlersProps {
    formData: AntecedenteCompleto;
    setFormData: React.Dispatch<React.SetStateAction<AntecedenteCompleto>>;
    formErrors: Record<string, string>;
    setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    currentMode: 'add' | 'view' | 'edit'; // Cambiado para consistencia
    antecedente?: AntecedenteCompleto | null;
    pacienteId?: number | null;
    validateForm: () => boolean;
    onSubmit?: (antecedente: AntecedenteCompleto) => Promise<void>;
    onAntecedenteAdded?: () => void;
    onAntecedenteUpdated?: () => void;
    onAntecedenteDeleted?: () => void;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
    setSubmitLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleClose: () => void;    
}

export const createAntecedenteHandlers = ({
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    currentMode,
    antecedente,
    pacienteId,
    validateForm,
    onSubmit,
    onAntecedenteAdded,
    onAntecedenteUpdated,
    onAntecedenteDeleted,
    setError,
    setSuccess,
    setSubmitLoading,
    setDeleteLoading,
    setConfirmDialogOpen,
    handleClose
}: HandlersProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value, checked, type } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
        
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDateChange = (date: Date | null): void => {
        setFormData(prev => ({
            ...prev,
            fecha: date || new Date()
        }));
        
        if (formErrors.fecha) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.fecha;
                return newErrors;
            });
        }
    };

    const handleEnfermedadesChange = (_event: React.SyntheticEvent, values: Option[]): void => {
        setFormData(prev => ({
            ...prev,
            enfermedades: values.map(v => v.id)
        }));
    };

    const handleHabitosChange = (_event: React.SyntheticEvent, values: Option[]): void => {
        setFormData(prev => ({
            ...prev,
            habitos: values.map(v => v.id)
        }));
    };

    const handleMedicacionesChange = (_event: React.SyntheticEvent, values: Option[]): void => {
        setFormData(prev => ({
            ...prev,
            medicaciones: values.map(v => v.id)
        }));
    };

    const handleAtencionesChange = (_event: React.SyntheticEvent, values: Option[]): void => {
        setFormData(prev => ({
            ...prev,
            atencionesMedicas: values.map(v => v.id)
        }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitLoading(true);
        setError(null);
        
        try {
            const dataToSubmit = {
                ...formData,
                idpaciente: formData.idpaciente || pacienteId || 0
            };

            if (onSubmit) {
                await onSubmit(dataToSubmit);
            } else {
                const endpoint = currentMode === 'edit' && antecedente?.idantecedente 
                    ? `/api/antecedents/${antecedente.idantecedente}` 
                    : '/api/antecedents';
                
                const method = currentMode === 'edit' ? 'PUT' : 'POST';
                
                const response = await fetch(endpoint, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSubmit)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(
                        errorData?.message || 
                        `Error ${response.status}: ${response.statusText}`
                    );
                }
            }
            
            setSuccess(
                currentMode === 'edit' 
                    ? 'Antecedente actualizado correctamente' 
                    : 'Antecedente registrado correctamente'
            );
            
            if (currentMode === 'edit' && onAntecedenteUpdated) {
                onAntecedenteUpdated();
            } else if (currentMode === 'add' && onAntecedenteAdded) {
                onAntecedenteAdded();
            }
            
            setTimeout(() => {
                handleClose();
            }, 1500);
            
        } catch (error) {
            console.error('Error al guardar el antecedente:', error);
            setError(error instanceof Error ? error.message : 'Error al guardar el antecedente');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (): Promise<void> => {
        if (!antecedente?.idantecedente) {
            setError('No se puede eliminar este antecedente');
            return;
        }
        
        setDeleteLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/antecedents/${antecedente.idantecedente}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message || 
                    `Error ${response.status}: ${response.statusText}`
                );
            }
            
            setSuccess('Antecedente eliminado correctamente');
            
            if (onAntecedenteDeleted) {
                onAntecedenteDeleted();
            }
            
            setTimeout(() => {
                handleClose();
            }, 1500);
            
        } catch (error) {
            console.error('Error al eliminar el antecedente:', error);
            setError(error instanceof Error ? error.message : 'Error al eliminar el antecedente');
        } finally {
            setDeleteLoading(false);
            setConfirmDialogOpen(false);
        }
    };

    return {
        handleChange,
        handleDateChange,
        handleEnfermedadesChange,
        handleHabitosChange,
        handleMedicacionesChange,
        handleAtencionesChange,
        handleSubmit,
        handleDelete
    };
};