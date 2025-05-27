'use client';
import React from 'react';
import { Container, Paper, Alert, Snackbar, Box } from '@mui/material';
import { PatientList } from '@/components/patients/PatientTable';
import { PatientViewDialog } from '@/components/patients/PatientViewDialog';
import { PatientForm } from '@/components/patients/PatientsForm';
import { PatientDeleteDialog } from '@/components/patients/PatientDeleteDialog';
import { usePatientsPage } from '@/presentation/hooks/usePatient';

export default function PatientsPage() {
    const {
        // States
        patients,
        loading,
        error,
        totalPatients,
        page,
        rowsPerPage,
        searchQuery,
        selectedPatient,
        viewDialogOpen,
        formDialogOpen,
        deleteDialogOpen,
        notification,
        
        // Handlers
        handleViewPatient,
        handleEditPatient,
        handleNewPatient,
        handleDeletePatient,
        handleConfirmDelete,
        handleCloseViewDialog,
        handleCloseFormDialog,
        handleCloseDeleteDialog,
        handleFormSuccess,
        handleCloseNotification,
        handleSearchChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleEditFromView,
        handleRefresh
    } = usePatientsPage();

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <h1>Gestión de Pacientes</h1>
              
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
                  onRefresh={handleRefresh}
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

            {/* Patient Form Dialog  */}
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