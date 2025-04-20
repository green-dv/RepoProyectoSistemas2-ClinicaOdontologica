'use client';

import { useEffect } from 'react';
import useHabits from '@/presentation/hooks/useHabit';
import useHabitHandlers from '@/presentation/handlers/useHabitHandler';
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

import HabitTable from '@/components/habits/HabitTable'; 
import HabitDialog from '@/components/habits/HabitDialog'; 

export default function HabitsComponent() {
  const habitsState = useHabits();
  const { 
    handleFetchHabits,
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
  } = useHabitHandlers(habitsState);
  
  const { 
    habits, 
    searchTerm, 
    showDisabled, 
    isLoading, 
    open,
    snackbar,
    newHabit,
    selectedHabit
  } = habitsState;

  useEffect(() => {
    handleFetchHabits(searchTerm);
  }, [searchTerm, showDisabled, handleFetchHabits]);

  // funtion para manejar el cambio en el input de busqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    habitsState.setSearchTerm(e.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Hábitos
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar Hábito..."
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
                Nuevo hábito
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Treatment tablass */}
        <HabitTable 
          habits={habits}
          isLoading={isLoading}
          showDisabled={showDisabled}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onDeletePermanently={handleDeletePermanently}
        />
      </Paper>
      
      <HabitDialog 
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        habit={newHabit}
        handleChange={handleChange}
        isEditing={!!selectedHabit}
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