import React from 'react';
import { Box, Alert } from '@mui/material';
import { Patient } from '@/domain/entities/Patient';
import { PatientDialog } from './PatientDialog';
import { PatientConfirmationDialog } from './PatientConfirmation';
import { usePatientForm } from '@/presentation/hooks/usePatientForm';
import { PersonalInfoSection } from './sections/personalSectionInfo';
import { ContactInfoSection } from './sections/contactSectionInfo';
import { AdditionalInfoSection } from './sections/additionalSectionInfo';
import { FormActions } from './FormActions';

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSubmitSuccess?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  open,
  onClose,
  patient,
  onSubmitSuccess
}) => {
  const {
    formData,
    birthDate,
    errors,
    loading,
    submitError,
    submitSuccess,
    confirmationOpen,
    addedPatient,
    isEditMode,
    handleInputChange,
    handleRadioChange,
    handleDateChange,
    handleSubmit,
    handleCloseConfirmation
  } = usePatientForm(patient, onClose, onSubmitSuccess);

  return (
    <>
      <PatientDialog
        open={open}
        onClose={onClose}
        title={isEditMode ? 'Editar Paciente' : 'Nuevo Paciente'}
        maxWidth="md"
        disableBackdropClick={loading}
        showActions={false}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {submitSuccess && !confirmationOpen && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {isEditMode ? 'Paciente actualizado con éxito!' : 'Paciente creado con éxito!'}
            </Alert>
          )}
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <PersonalInfoSection
            formData={formData}
            birthDate={birthDate}
            errors={errors}
            loading={loading}
            handleInputChange={handleInputChange}
            handleRadioChange={handleRadioChange}
            handleDateChange={handleDateChange}
          />
          
          <ContactInfoSection
            formData={formData}
            errors={errors}
            loading={loading}
            handleInputChange={handleInputChange}
          />
          
          <AdditionalInfoSection
            formData={formData}
            loading={loading}
            handleInputChange={handleInputChange}
          />
          
          <FormActions
            onClose={onClose}
            loading={loading}
            isEditMode={isEditMode}
          />
        </Box>
      </PatientDialog>

      <PatientConfirmationDialog
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        patient={addedPatient}
        isEditing={isEditMode}
      />
    </>
  );
};