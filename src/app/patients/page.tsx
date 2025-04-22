"use client";
import React from 'react';
import PatientsTable from '@/components/patients/PatientTable';
import PatientDialog from '@/components/patients/PatientDialog';
import SearchBar from '@/components/SearchBar';
import { Patient } from '@/domain/entities/Patient';
import { Alert, Button, Snackbar, Typography, Box, Container, Switch, FormControlLabel } from '@mui/material';
import usePatients from '@/presentation/hooks/usePatient';
import usePatientHandlers from '@/presentation/handlers/usePatientHandlers';

const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    console.error("Error formateando fecha:", e);
  }
  
  return dateString; 
};

interface HTMLInputElementWithName extends HTMLInputElement {
  name: string;
  value: string;
}

export default function PatientsPage() {
  const patientState = usePatients();
  const {
    patients,
    open,
    searchTerm,
    newPatient,
    showDisabled,
    isLoading,
    selectedPatient,
    snackbar,
    pagination
  } = patientState;

  const {
    handleFetchPatients,
    handleOpen,
    handleClose,
    handleChange,
    handleBooleanChange,
    handleDelete,
    handleRestore,
    handleDeletePermanently,
    handleSubmit,
    toggleView,
    handleSnackbarClose,
    handlePaginationChange
  } = usePatientHandlers(patientState);

  const customHandleEdit = (patient: Patient) => {
    const formattedPatient = {
      ...patient,
      fechanacimiento: patient.fechanacimiento ? formatDateForInput(patient.fechanacimiento) : null
    };
    
    console.log("Editando paciente con fecha:", formattedPatient.fechanacimiento);
    
    patientState.setNewPatient({
      nombres: formattedPatient.nombres || '',
      apellidos: formattedPatient.apellidos || '',
      direccion: formattedPatient.direccion || '',
      telefonodomicilio: formattedPatient.telefonodomicilio || null,
      telefonopersonal: formattedPatient.telefonopersonal || '',
      lugarnacimiento: formattedPatient.lugarnacimiento || null,
      fechanacimiento: formattedPatient.fechanacimiento || '', 
      sexo: formattedPatient.sexo !== undefined ? formattedPatient.sexo : true,
      estadocivil: formattedPatient.estadocivil || 'Soltero',
      ocupacion: formattedPatient.ocupacion || '',
      aseguradora: formattedPatient.aseguradora || null,
    });
    
    patientState.setSelectedPatient(patient);
    patientState.setOpen(true);
  };

  const customHandleSubmit = async () => {
    if (newPatient.fechanacimiento) {
      try {
        const date = new Date(newPatient.fechanacimiento);
        if (isNaN(date.getTime())) {
          patientState.showMessage("La fecha de nacimiento no es válida", "error");
          return;
        }
        
        if (date > new Date()) {
          patientState.showMessage("La fecha de nacimiento no puede ser en el futuro", "error");
          return;
        }
      } catch (error) {
        patientState.showMessage("Error al procesar la fecha de nacimiento", "error");
        return;
      }
    }
    handleSubmit();
  };

  const customHandleDateChange = (e: React.ChangeEvent<HTMLInputElementWithName>) => {
    const { name, value } = e.target;
    console.log(`Cambiando fecha: ${name} = ${value}`);
    
    const dateValue = value.trim() === '' ? null : value;
    
    patientState.setNewPatient((prev) => ({ 
      ...prev, 
      [name]: dateValue
    }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Pacientes
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button variant="contained" onClick={handleOpen}>
            Añadir Paciente
          </Button>
          <FormControlLabel
            control={<Switch checked={showDisabled} onChange={toggleView} />}
            label="Mostrar Inactivos"
          />
        </Box>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={patientState.setSearchTerm}
          placeholder="Buscar pacientes por nombre o apellido..."
        />

        <PatientDialog
          open={open}
          onClose={handleClose}
          onSubmit={customHandleSubmit}
          patient={newPatient}
          handleChange={handleChange}
          handleBooleanChange={handleBooleanChange}
          handleDateChange={customHandleDateChange}
          isEditing={!!selectedPatient}
        />
        <PatientsTable
          patients={patients}
          showDisabled={showDisabled}
          isLoading={isLoading}
          pagination={pagination}
          onEdit={customHandleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onDeletePermanently={handleDeletePermanently}
          onPaginationChange={handlePaginationChange}
        />

        <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={handleSnackbarClose}>
          {snackbar && <Alert severity={snackbar.severity}>{snackbar.message}</Alert>}
        </Snackbar>
      </Box>
    </Container>
  );
}