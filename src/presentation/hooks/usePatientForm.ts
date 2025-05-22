import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Patient } from '@/domain/entities/Patient';
import { createPatientValidationUseCase, PatientValidationUseCase } from '@/application/validators/patientValidationUseCases';
import { PatientValidator } from '@/domain/validation/PatientValidator';

type FormErrors = { 
    [key in keyof Patient]?: string;
};

export interface UsePatientFormReturn {
    formData: Patient;
    birthDate: Date | null;
    errors: FormErrors;
    loading: boolean;
    submitError: string | null;
    submitSuccess: boolean;
    confirmationOpen: boolean;
    addedPatient: Patient | null;
    isEditMode: boolean;
    validateForm: () => Promise<boolean>;
    validateField: (fieldName: keyof Patient, value: unknown) => Promise<string | null>;
    isFieldRequired: (fieldName: keyof Patient) => boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDateChange: (date: Date | null) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleCloseConfirmation: () => void;
    resetForm: () => void;
}

export const usePatientForm = (
    patient: Patient | null,
    onClose: () => void,
    onSubmitSuccess?: () => void,
    existingPatients: Patient[] = []
): UsePatientFormReturn => {
    const isEditMode = !!patient?.idpaciente;
    const validationUseCase: PatientValidationUseCase = createPatientValidationUseCase();
    
    const initialFormData: Patient = {
        nombres: '',
        apellidos: '',
        direccion: '',
        telefonodomicilio: '',
        telefonopersonal: '',
        lugarnacimiento: '',
        fechanacimiento: '',
        sexo: true, 
        estadocivil: '',
        ocupacion: '',
        aseguradora: '',
        habilitado: true
};

const [formData, setFormData] = useState<Patient>(initialFormData);
const [birthDate, setBirthDate] = useState<Date | null>(null);
const [errors, setErrors] = useState<FormErrors>({});
const [loading, setLoading] = useState<boolean>(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
const [addedPatient, setAddedPatient] = useState<Patient | null>(null);

    // Resetear formulario
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setBirthDate(null);
        setErrors({});
        setSubmitError(null);
        setSubmitSuccess(false);
        setConfirmationOpen(false);
        setAddedPatient(null);
    }, []);

    // Validar un campo específico
    const validateField = useCallback(async (fieldName: keyof Patient, value: unknown): Promise<string | null> => {
        try {
            return await validationUseCase.validateField(fieldName, value);
        } catch (error) {
            console.error(`Error validating field ${fieldName}:`, error);
            return 'Error de validación';
        }
    }, [validationUseCase]);

    // Verificar si un campo es requerido
    const isFieldRequired = useCallback((fieldName: keyof Patient): boolean => {
        return PatientValidator.isFieldRequired(fieldName);
    }, []);

    // Validar todo el formulario
    const validateForm = useCallback(async (): Promise<boolean> => {
        try {
            setLoading(true);
            
            let validationResult;
            
            if (isEditMode) {
                validationResult = await validationUseCase.validateForUpdate(formData);
            } else {
                const { idpaciente, ...patientWithoutId } = formData;
                validationResult = await validationUseCase.validateForCreation(patientWithoutId);
            }

            // Validar duplicados
            const duplicateError = await validationUseCase.validateDuplicate(
                formData, 
                existingPatients, 
                isEditMode ? patient?.idpaciente : undefined
            );

            const finalErrors: FormErrors = { ...validationResult.errors };
            
            if (duplicateError) {
                finalErrors.nombres = duplicateError;
            }

            setErrors(finalErrors);
            
            return validationResult.isValid && !duplicateError;
            
        } catch (error) {
            console.error('Error en validación del formulario:', error);
            setErrors({ nombres: 'Error interno de validación' });
            return false;
        } finally {
            setLoading(false);
        }
    }, [formData, isEditMode, existingPatients, patient?.idpaciente, validationUseCase]);

    // Efecto para inicializar el formulario
    useEffect(() => {
        setErrors({});
        setSubmitError(null);
        setSubmitSuccess(false);
        setConfirmationOpen(false);
        setAddedPatient(null);
        
        if (patient) {
            setFormData({
                ...patient,
            });
            
            if (patient.fechanacimiento) {
                try {
                    const dateObj = new Date(patient.fechanacimiento);
                    if (!isNaN(dateObj.getTime())) {
                        setBirthDate(dateObj);
                    }
                } catch (error) {
                    console.error('Error parsing date:', error);
                    setBirthDate(null);
                }
            }
        } else {
            setFormData(initialFormData);
            setBirthDate(null);
        }
    }, [patient]);

    // Manejar cambios en inputs de texto
    const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof Patient;
        
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        
        // Limpiar error del campo si existe
        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: undefined
            }));
        }

        // Validación en tiempo real para campos críticos
        if (['nombres', 'apellidos', 'telefonopersonal'].includes(name)) {
            const error = await validateField(fieldName, value);
            if (error) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: error
                }));
            }
        }
    }, [errors, validateField]);

    // Manejar cambios en radio buttons
    const handleRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === 'true';
        setFormData(prevData => ({
            ...prevData,
            sexo: value
        }));
    }, []);

    // Manejar cambios en fecha
    const handleDateChange = useCallback(async (date: Date | null) => {
        setBirthDate(date);
        
        let formattedDate = '';
        if (date) {
            formattedDate = format(date, 'yyyy-MM-dd');
        }
        
        setFormData(prevData => ({
            ...prevData,
            fechanacimiento: formattedDate
        }));

        // Validar fecha en tiempo real
        const error = await validateField('fechanacimiento', formattedDate);
        if (error) {
            setErrors(prev => ({
                ...prev,
                fechanacimiento: error
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                fechanacimiento: undefined
            }));
        }
    }, [validateField]);

    // Manejar envío del formulario
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        
        const isValid = await validateForm();
        if (!isValid) {
            return;
        }
        
        setLoading(true);
        
        try {
            let response;
            
            if (isEditMode) {
                // Actualizar paciente existente
                response = await fetch(`/api/patients/${patient!.idpaciente}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            } else {
                // Crear nuevo paciente
                const { idpaciente, ...patientWithoutId } = formData;
                response = await fetch('/api/patients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(patientWithoutId),
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error saving patient data');
            }
            
            const savedPatient = await response.json();
            
            setSubmitSuccess(true);
            setAddedPatient(savedPatient.data || formData);
            setConfirmationOpen(true);
            
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, [validateForm, isEditMode, patient, formData, onSubmitSuccess]);

    // Manejar cierre de confirmación
    const handleCloseConfirmation = useCallback(() => {
        setConfirmationOpen(false);
        setSubmitSuccess(false); 
        setAddedPatient(null); 
        onClose();
    }, [onClose]);

    return {
        formData,
        birthDate,
        errors,
        loading,
        submitError,
        submitSuccess,
        confirmationOpen,
        addedPatient,
        isEditMode,
        validateForm,
        validateField,
        isFieldRequired,
        handleInputChange,
        handleRadioChange,
        handleDateChange,
        handleSubmit,
        handleCloseConfirmation,
        resetForm
    };
};    

export default usePatientForm;