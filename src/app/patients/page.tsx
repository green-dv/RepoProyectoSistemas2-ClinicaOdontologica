"use client";
import React, { useState, useEffect } from 'react';
import PatientsTable from '@/components/patients/PatientTable';
import PatientDialog from '@/components/patients/PatientDialog';
import SearchBar from '@/components/SnackbarAlert';
import { Patient, PatientDTO } from '@/domain/entities/Patient';
import { Alert, AlertColor, Button, Snackbar, Typography, Box, Container, Switch, FormControlLabel } from '@mui/material';
import usePatientHandlers from '@/presentation/handlers/usePatientHandlers';

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

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

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: AlertColor } | null>(null);
  
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    pageSize: 10,
    total: 0
  });

  const [newPatient, setNewPatient] = useState<PatientDTO>({
    nombres: '',
    apellidos: '',
    direccion: '',
    telefonodomicilio: null,
    telefonopersonal: '',
    lugarnacimiento: null,
    fechanacimiento: null, // cambiar a null por el momento
    sexo: true, 
    estadocivil: 'Soltero', 
    ocupacion: '',
    aseguradora: null
  });

  const resetForm = () => {
    setNewPatient({
      nombres: '',
      apellidos: '',
      direccion: '',
      telefonodomicilio: null,
      telefonopersonal: '',
      lugarnacimiento: null,
      fechanacimiento: null, 
      sexo: true,
      estadocivil: 'Soltero', 
      ocupacion: '',
      aseguradora: null
    });
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  const customHandleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Cambiando fecha: ${name} = ${value}`);
    
    const dateValue = value.trim() === '' ? null : value;
    
    setNewPatient((prev) => ({ 
      ...prev, 
      [name]: dateValue
    }));
  };

  const handlers = usePatientHandlers({
    patients,
    open,
    searchTerm,
    newPatient,
    showDisabled,
    isLoading,
    selectedPatient,
    snackbar,
    setPatients,
    setOpen,
    setSearchTerm,
    setNewPatient,
    setShowDisabled,
    setIsLoading,
    setSelectedPatient,
    setSnackbar,
    resetForm,
    showMessage
  });

  const {
    handleFetchPatients,
    handleOpen,
    handleClose,
    handleChange,
    handleBooleanChange,
    handleEdit,
    handleDelete,
    handleRestore,
    handleDeletePermanently,
    handleSubmit,
    toggleView,
    handleSnackbarClose
  } = handlers;

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, page, pageSize }));
  };

  const customHandleEdit = (patient: Patient) => {
    const formattedPatient = {
      ...patient,
      fechanacimiento: patient.fechanacimiento ? formatDateForInput(patient.fechanacimiento) : null
    };
    
    console.log("Editando paciente con fecha:", formattedPatient.fechanacimiento);
    
    setNewPatient({
      nombres: formattedPatient.nombres || '',
      apellidos: formattedPatient.apellidos || '',
      direccion: formattedPatient.direccion || '',
      telefonodomicilio: formattedPatient.telefonodomicilio || null,
      telefonopersonal: formattedPatient.telefonopersonal || '',
      lugarnacimiento: formattedPatient.lugarnacimiento || null,
      fechanacimiento: formattedPatient.fechanacimiento, 
      sexo: formattedPatient.sexo !== undefined ? formattedPatient.sexo : true,
      estadocivil: formattedPatient.estadocivil || 'Soltero',
      ocupacion: formattedPatient.ocupacion || '',
      aseguradora: formattedPatient.aseguradora || null,
    });
    
    setSelectedPatient(patient);
    setOpen(true);
  };

  const customHandleSubmit = async () => {
    if (newPatient.fechanacimiento) {
      try {
        const date = new Date(newPatient.fechanacimiento);
        if (isNaN(date.getTime())) {
          showMessage("La fecha de nacimiento no es válida", "error");
          return;
        }
        
        if (date > new Date()) {
          showMessage("La fecha de nacimiento no puede ser en el futuro", "error");
          return;
        }
      } catch (error) {
        showMessage("Error al procesar la fecha de nacimiento", error as AlertColor);
        return;
      }
    }
    handleSubmit();
  };

  useEffect(() => {
    handleFetchPatients(searchTerm);
    setPagination(prev => ({ ...prev, total: patients.length }));
  }, [searchTerm, showDisabled]);

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
          setSearchTerm={setSearchTerm}
          placeholder="Buscar pacientes..."
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