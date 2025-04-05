'use client';

import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
} from '@mui/material';
import { Add } from '@mui/icons-material';

// Domaiinss
import { Treatment, TreatmentDTO } from '@/domain/entities/Treatments';

// Usecasesss
import { 
  fetchTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  restoreTreatment,
  deleteTreatmentPermanently
} from '@/application/usecases/treatments';

// cpmponentes del UI
import TreatmentTable from '@/components/treatments/TreatmentTable';
import TreatmentDialog from '@/components/treatments/TreatmentDialog';
import SnackbarAlert, { SnackbarMessage } from '@/components/SnackbarAlert';

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newTreatment, setNewTreatment] = useState<TreatmentDTO>({
    nombre: '',   
    descripcion: '',
    precio: 0,
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const handleSnackbarClose = () => {
    setSnackbar(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  // Esto hay que corregir en catch
  const handleFetchTreatments = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      try {
        const data = await fetchTreatments(query, showDisabled);
        setTreatments(data);
      } catch (error) {
        showMessage('Error al cargar los Tratamientos', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [showDisabled]
  );

  useEffect(() => {
    handleFetchTreatments(searchTerm);
    return () => handleFetchTreatments.cancel();
  }, [searchTerm, handleFetchTreatments]);

  const handleOpen = () => {
    setSelectedTreatment(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'precio') {
      const numericValue = parseFloat(value) || 0;
      setNewTreatment(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setNewTreatment(prev => ({
        ...prev, 
        [name]: value || ''  
      }));
    }
  };

  const resetForm = () => {
    setNewTreatment({
      nombre: '',
      descripcion: '',
      precio: 0,
    });
    setSelectedTreatment(null);
  };

  const handleEdit = (treatment: Treatment) => {
    setNewTreatment({
      nombre: treatment.nombre || '',
      descripcion: treatment.descripcion || '',
      precio: treatment.precio || 0,
    });
    setSelectedTreatment(treatment);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTreatment(id);
      setTreatments((prev) => prev.filter((treatment) => treatment.idtratamiento !== id));
      showMessage('Tratamiento eliminado correctamente', 'success');
    } catch {
      showMessage('Error al eliminar el tratamiento', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreTreatment(id);
      setTreatments((prev) => prev.filter((treatment) => treatment.idtratamiento !== id));
      showMessage('Tratamiento restaurado correctamente', 'success');
    } catch {
      showMessage('Error al restaurar el Tratamiento', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este producto permanentemente? no hay vuelta atras.')) return;
    try {
      await deleteTreatmentPermanently(id);
      showMessage('Tratamiento eliminado permanentemente', 'success');
      handleFetchTreatments(searchTerm);
    } catch {
      showMessage('Error al eliminar el Tratamiento', 'error');
    }
  };

  const handleSubmit = async () => { 
    try {
      // Verificar duplicaditos
      const isDuplicate = treatments.some(
        treatment => 
          treatment.nombre.toLowerCase().trim() === newTreatment.nombre.toLowerCase().trim() && 
          treatment.idtratamiento !== selectedTreatment?.idtratamiento
      );

      if (isDuplicate) {
        showMessage('El tratamiento ya existe', 'error');
        return;
      }

      if (selectedTreatment) {
        const updatedTreatment = await updateTreatment(selectedTreatment.idtratamiento, newTreatment);
        setTreatments(prev =>
          prev.map((t) => t.idtratamiento === updatedTreatment.idtratamiento ? updatedTreatment : t)
        );
        showMessage('Tratamiento actualizado correctamente', 'success');
      } else {
        const addedTreatment = await createTreatment(newTreatment);
        setTreatments((prev) => [...prev, addedTreatment]);
        showMessage('Tratamiento agregado correctamente', 'success');
      }
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        showMessage(error.message, 'error');
      } else {
        showMessage('Ocurrió un error inesperado', 'error');
      }
    }
  };

  const toggleView = () => {
    setShowDisabled((prev) => !prev);
    setTreatments([]); 
    setSearchTerm(''); 
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestión de Tratamientos
      </Typography>
      <TextField 
        label="Buscar tratamiento..." 
        fullWidth 
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button variant="outlined" color="primary" onClick={toggleView}>
          {showDisabled ? 'Ver Habilitados' : 'Ver Inhabilitados'}
        </Button>
        {!showDisabled && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Añadir Tratamiento
          </Button>
        )}
      </Box>

      <TreatmentTable 
        treatments={treatments}
        isLoading={isLoading}
        showDisabled={showDisabled}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onDeletePermanently={handleDeletePermanently}
      />

      <TreatmentDialog 
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        treatment={newTreatment}
        handleChange={handleChange}
        isEditing={!!selectedTreatment}
      />

      <SnackbarAlert 
        snackbar={snackbar}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
}