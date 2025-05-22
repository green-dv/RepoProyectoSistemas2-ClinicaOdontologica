// @/presentation/components/patients/PatientForm.tsx
import React from 'react';
import { Box, Alert, LinearProgress } from '@mui/material';
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
    existingPatients?: Patient[];
    onSubmitSuccess?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
    open,
    onClose,
    patient,
    existingPatients = [],
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
        isFieldRequired,
        handleInputChange,
        handleRadioChange,
        handleDateChange,
        handleSubmit,
        handleCloseConfirmation
    } = usePatientForm(patient, onClose, onSubmitSuccess, existingPatients);

    // Función para contar errores
    const errorCount = Object.keys(errors).filter(key => errors[key as keyof Patient]).length;

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
                    {/* Barra de progreso durante carga */}
                    {loading && (
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <LinearProgress />
                        </Box>
                    )}

                    {/* Mensaje de éxito */}
                    {submitSuccess && !confirmationOpen && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {isEditMode ? 
                                'Paciente actualizado con éxito!' : 
                                'Paciente creado con éxito!'
                            }
                        </Alert>
                    )}

                    {/* Mensaje de error */}
                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {submitError}
                        </Alert>
                    )}

                    {/* Resumen de errores de validación */}
                    {errorCount > 0 && !loading && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Por favor, corrija {errorCount} error{errorCount > 1 ? 'es' : ''} en el formulario antes de continuar.
                        </Alert>
                    )}

                    {/* Secciones del formulario */}
                    <PersonalInfoSection
                        formData={formData}
                        birthDate={birthDate}
                        errors={errors}
                        loading={loading}
                        isFieldRequired={isFieldRequired}
                        handleInputChange={handleInputChange}
                        handleRadioChange={handleRadioChange}
                        handleDateChange={handleDateChange}
                    />

                    <ContactInfoSection
                        formData={formData}
                        errors={errors}
                        loading={loading}
                        isFieldRequired={isFieldRequired}
                        handleInputChange={handleInputChange}
                    />

                    <AdditionalInfoSection
                        formData={formData}
                        errors={errors}
                        loading={loading}
                        isFieldRequired={isFieldRequired}
                        handleInputChange={handleInputChange}
                    />

                    {/* Botones de acción */}
                    <FormActions
                        onClose={onClose}
                        loading={loading}
                        isEditMode={isEditMode}
                    />
                </Box>
            </PatientDialog>

            {/* Diálogo de confirmación */}
            <PatientConfirmationDialog
                open={confirmationOpen}
                onClose={handleCloseConfirmation}
                patient={addedPatient}
                isEditing={isEditMode}
            />
        </>
    );
};