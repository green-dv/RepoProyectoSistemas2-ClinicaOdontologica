import { useState } from 'react';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';

interface AntecedentFormErrors {
  fecha?: string;
}

export const useAntecedentForm = (initialData?: AntecedenteCompleto) => {
  const defaultData: AntecedenteCompleto = {
    idpaciente: 0,
    embarazo: false,
    habilitado: true,
    fecha: new Date(),
    enfermedades: [],
    habitos: [],
    medicaciones: [],
    atencionesMedicas: [],
  };

  const [antecedentForm, setAntecedentForm] = useState<AntecedenteCompleto>(initialData || defaultData);
  const [antecedentErrors, setAntecedentErrors] = useState<AntecedentFormErrors>({});

  const handleAntecedentChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      setAntecedentForm((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (antecedentErrors[name as keyof AntecedentFormErrors]) {
        setAntecedentErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    }
  };

  const validateAntecedentForm = (): boolean => {
    const errors: AntecedentFormErrors = {};
    let isValid = true;

    if (!antecedentForm.fecha) {
      errors.fecha = 'La fecha es obligatoria';
      isValid = false;
    }

    setAntecedentErrors(errors);
    return isValid;
  };

  const resetAntecedentForm = () => {
    setAntecedentForm(defaultData);
    setAntecedentErrors({});
  };

  return {
    antecedentForm,
    antecedentErrors,
    handleAntecedentChange,
    validateAntecedentForm,
    resetAntecedentForm,
    setAntecedentForm,
  };
};

export default useAntecedentForm;