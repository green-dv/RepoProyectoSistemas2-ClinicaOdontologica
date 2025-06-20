'use client';

import { useEffect } from 'react';
import useMedicalAttentions from '@/presentation/hooks/useMedicalAttention';
import useMedicalAttentionHandler from '@/presentation/handlers/useMedicalAttentionHandler';
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

import MedicalAttentionTable from '@/components/medicalAttentions/MedicalAttentionTable'; 
import MedicalAttentionDialog from '@/components/medicalAttentions/MedicalAttentionDialog'; 

export default function MedicalAttentionsComponent() {
  const habitsState = useMedicalAttentions();
  const { 
    handleFetchMedicalAttentions,
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
  } = useMedicalAttentionHandler(habitsState);
  
  const { 
    medicalAttentions, 
    searchTerm, 
    showDisabled, 
    isLoading, 
    open,
    snackbar,
    newMedicalAttention,
    selectedMedicalAttention
  } = habitsState;

  useEffect(() => {
    handleFetchMedicalAttentions(searchTerm);
  }, [searchTerm, showDisabled, handleFetchMedicalAttentions]);

  // funtion para manejar el cambio en el input de busqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    habitsState.setSearchTerm(e.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Descripciones de Atenciones Médicas
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar Descripción..."
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
                Nueva descripción
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Treatment tablass */}
        <MedicalAttentionTable 
          medicalAttentions={medicalAttentions}
          isLoading={isLoading}
          showDisabled={showDisabled}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onDeletePermanently={handleDeletePermanently}
        />
      </Paper>
      
      <MedicalAttentionDialog 
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        medicalAttention={newMedicalAttention}
        handleChange={handleChange}
        isEditing={!!selectedMedicalAttention}
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