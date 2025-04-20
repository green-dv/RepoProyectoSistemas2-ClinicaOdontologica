'use client';

import { useEffect } from 'react';
import useMedications from '@/presentation/hooks/useMedications';
import useMedicationHandlers from '@/presentation/handlers/useMedicationHanlders';
import {
  Box,
  Button,
  TextField,
  AlertColor,
  Typography,
  Container,
  Grid,
  Paper,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import { Add, Search, Visibility, VisibilityOff } from '@mui/icons-material';

import MedicationTable from '@/components/medications/MedicationTable'; 
import MedicationDialog from '@/components/medications/MedicationDialog'; 

export default function MedicationsComponent() {
  const medicationsState = useMedications();
  const { 
    handleFetchMedications,
    handleOpen,
    handleClose,
    handleChange,
    handleEdit,
    handleDelete,
    handleRestore,
    handleDeletePermanently,
    handleSubmit,
    toggleView,
    handleSnackbarClose
  } = useMedicationHandlers(medicationsState);
  
  const { 
    medications, 
    searchTerm, 
    showDisabled, 
    isLoading, 
    open,
    snackbar,
    newMedication,
    selectedMedication
  } = medicationsState;

  useEffect(() => {
    handleFetchMedications(searchTerm);
  }, [searchTerm, showDisabled, handleFetchMedications]);

  // funtion para manejar el cambio en el input de busqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    medicationsState.setSearchTerm(e.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Medicación
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar Medicación..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button 
                variant="outlined" 
                startIcon={showDisabled ? <Visibility /> : <VisibilityOff />}
                onClick={toggleView}
              >
                {showDisabled ? 'Mostrar Activos' : 'Mostrar Desactivados'}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={handleOpen}
              >
                Nueva Medicación
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Treatment tablass */}
        <MedicationTable 
          medications={medications}
          isLoading={isLoading}
          showDisabled={showDisabled}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onDeletePermanently={handleDeletePermanently}
        />
      </Paper>
      
      <MedicationDialog 
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        medication={newMedication}
        handleChange={handleChange}
        isEditing={!!selectedMedication}
      />
      
      {/* Snackbar para notificacionesss */}
      {snackbar && (
        <Snackbar 
          open={!!snackbar} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity as 'success' | 'error' | 'info' | 'warning'}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}