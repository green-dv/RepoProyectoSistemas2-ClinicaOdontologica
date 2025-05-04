'use client';

import { useEffect } from 'react';
import useIllnessHandlers from '@/presentation/handlers/useIllnessHandler';
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

import IllnessTable from '@/components/illnesses/IllnessTable'; 
import IllnessDialog from '@/components/illnesses/IllnessDialog';
import useIllnesses from '@/presentation/hooks/useIllness';

export default function IllnessesComponent() {
  const illnessesState = useIllnesses();
  const { 
    handleFetchIllnesses,
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
  } = useIllnessHandlers(illnessesState);
  
  const { 
    illnesses, 
    searchTerm, 
    showDisabled, 
    isLoading, 
    open,
    snackbar,
    newIllness,
    selectedIllness
  } = illnessesState;

  useEffect(() => {
    handleFetchIllnesses(searchTerm);
  }, [searchTerm, showDisabled, handleFetchIllnesses]);

  // funtion para manejar el cambio en el input de busqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    illnessesState.setSearchTerm(e.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Enfermedades
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar Enfermedad..."
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
                Nueva enfermedad
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Treatment tablass */}
        <IllnessTable 
          illnesses={illnesses}
          isLoading={isLoading}
          showDisabled={showDisabled}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onDeletePermanently={handleDeletePermanently}
        />
      </Paper>
      
      <IllnessDialog 
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        illness={newIllness}
        handleChange={handleChange}
        isEditing={!!selectedIllness}
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