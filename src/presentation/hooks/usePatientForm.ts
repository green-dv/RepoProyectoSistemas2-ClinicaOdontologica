import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Patient } from '@/domain/entities/Patient';

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
    validateForm: () => boolean;
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
    onSubmitSuccess?: () => void
  ): UsePatientFormReturn => {
    const isEditMode = !!patient?.idpaciente;
    
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

    //resetear formulario
    const resetForm = () => {
      setFormData(initialFormData);
      setBirthDate(null);
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
      setConfirmationOpen(false);
      setAddedPatient(null);
    };

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
        setFormData({
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
        });
        setBirthDate(null);
      }
    }, [patient]);

    const validateForm = (): boolean => {
      const newErrors: FormErrors = {};
      
      if (!formData.nombres.trim()) {
        newErrors.nombres = 'Los nombres son requeridos';
      }
      
      if (!formData.apellidos.trim()) {
        newErrors.apellidos = 'Los apellidos son requeridos';
      }
      
      if (formData.telefonopersonal && !/^\d{7,15}$/.test(formData.telefonopersonal.replace(/\D/g, ''))) {
        newErrors.telefonopersonal = 'Formato de teléfono inválido';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
      
      if (errors[name as keyof Patient]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === 'true';
      setFormData(prevData => ({
        ...prevData,
        sexo: value
      }));
    };

    const handleDateChange = (date: Date | null) => {
      setBirthDate(date);
      
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setFormData(prevData => ({
          ...prevData,
          fechanacimiento: formattedDate
        }));
      } else {
        setFormData(prevData => ({
          ...prevData,
          fechanacimiento: ''
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      
      if (!validateForm()) {
        return;
      }
      
      setLoading(true);
      
      try {
        let response;
        
        if (isEditMode) {
          // Update existing patient
          response = await fetch(`/api/patients/${patient!.idpaciente}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
        } else {
          // Create new patient
          response = await fetch('/api/patients', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
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
    };

    const handleCloseConfirmation = () => {
      setConfirmationOpen(false);
      setSubmitSuccess(false); 
      setAddedPatient(null); 
      onClose();
    };

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
      handleInputChange,
      handleRadioChange,
      handleDateChange,
      handleSubmit,
      handleCloseConfirmation,
      resetForm
    };
};

export default usePatientForm;