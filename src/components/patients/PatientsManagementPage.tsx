'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Alert, Snackbar, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PatientList } from '@/components/patients/PatientTable';
import { PatientViewDialog } from '@/components/patients/PatientViewDialog';
import { PatientForm } from '@/components/patients/PatientsForm';
import { PatientDeleteDialog } from '@/components/patients/PatientDeleteDialog';
import { Patient } from '@/domain/entities/Patient';
import { PatientResponse } from '@/domain/dto/patient';

export default function PatientsPage() {
  // Data state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dialog control state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success'
  });

  // Fetch patients data from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: String(page + 1),
        limit: String(rowsPerPage),
      });

      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }

      const response = await fetch(`/api/patients?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los pacientes');
      }
      
      const data: PatientResponse = await response.json();
      
      setPatients(data.data);
      setTotalPatients(data.pagination.totalItems);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Error al cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  // Load patients on initial render and when dependencies change
  useEffect(() => {
    fetchPatients();
  }, [page, rowsPerPage, searchQuery]);

  // Dialog handlers
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormDialogOpen(true);
  };

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setFormDialogOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }
      
      // Refresh the patient list
      await fetchPatients();
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Paciente eliminado con éxito',
        type: 'success'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      
      // Show error notification
      setNotification({
        open: true,
        message: 'Error al eliminar el paciente',
        type: 'error'
      });
      
      return false;
    }
  };

  // Close dialog handlers
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    // Don't reset selected patient immediately in case we want to edit
  };

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    fetchPatients();
    
    setNotification({
      open: true,
      message: selectedPatient?.idpaciente 
        ? 'Paciente actualizado con éxito' 
        : 'Nuevo paciente creado con éxito',
      type: 'success'
    });
  };

  // Other handlers
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(0); // Reset to first page when search changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when rows per page changes
  };

  // View to Edit transition
  const handleEditFromView = () => {
    setViewDialogOpen(false);
    setFormDialogOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1>Gestión de Pacientes</h1>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleNewPatient}
        >
          Nuevo Paciente
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <PatientList
          patients={patients}
          loading={loading}
          error={error}
          totalPatients={totalPatients}
          page={page}
          rowsPerPage={rowsPerPage}
          searchQuery={searchQuery}
          onViewPatient={handleViewPatient}
          onEditPatient={handleEditPatient}
          onDeletePatient={handleDeletePatient}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRefresh={fetchPatients}
          onCreatePatient={handleNewPatient}
        />
      </Paper>

      {/* Patient View Dialog */}
      <PatientViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        patient={selectedPatient}
        onEdit={handleEditFromView}
      />

      {/* Patient Form Dialog for both Create and Edit */}
      <PatientForm
        open={formDialogOpen}
        onClose={handleCloseFormDialog}
        patient={selectedPatient}
        onSubmitSuccess={handleFormSuccess}
      />

      {/* Patient Delete Dialog */}
      <PatientDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        patient={selectedPatient}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}