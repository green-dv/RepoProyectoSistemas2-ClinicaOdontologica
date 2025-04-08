'use client';

import { useEffect } from 'react';
import useTreatments from '@/presentation/hooks/useTreatment';
import useTreatmentHandlers from '@/presentation/handlers/useTreatmentHandlers';
// Import Material UI components
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import { Add, Search, Visibility, VisibilityOff } from '@mui/icons-material';

// Import your custom components
import TreatmentTable from '@/components/treatments/TreatmentTable'; // Update path if necessary
import TreatmentDialog from '@/components/treatments/TreatmentDialog'; // Update path if necessary

export default function TreatmentsPage() {
  const treatmentsState = useTreatments();
  const { 
    handleFetchTreatments,
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
  } = useTreatmentHandlers(treatmentsState);
  
  const { 
    treatments, 
    searchTerm, 
    showDisabled, 
    isLoading, 
    open,
    snackbar,
    newTreatment,
    selectedTreatment
  } = treatmentsState;

  useEffect(() => {
    handleFetchTreatments(searchTerm);
  }, [searchTerm, showDisabled, handleFetchTreatments]);

  // Function to handle search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    treatmentsState.setSearchTerm(e.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Tratamientos
        </Typography>
        
        {/* Search and Action Controls */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar tratamientos..."
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
                Nuevo Tratamiento
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Treatment Table */}
        <TreatmentTable 
          treatments={treatments}
          isLoading={isLoading}
          showDisabled={showDisabled}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onDeletePermanently={handleDeletePermanently}
        />
      </Paper>
      
      {/* Treatment Dialog for Create/Edit */}
      <TreatmentDialog 
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        treatment={newTreatment}
        handleChange={handleChange}
        isEditing={!!selectedTreatment}
      />
      
      {/* Snackbar for notifications */}
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