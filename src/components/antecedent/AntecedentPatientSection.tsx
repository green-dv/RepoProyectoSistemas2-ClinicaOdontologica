'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Box,
  Autocomplete,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
  Dialog as ConfirmDialog,
  DialogTitle as ConfirmDialogTitle,
  DialogContent as ConfirmDialogContent,
  DialogActions as ConfirmDialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Hooks
import { useAntecedenteForm } from '@/presentation/hooks/useAntecedentForm';
import { useAntecedenteOptions, Option } from '@/presentation/hooks/useAntecedentsOptions';
import { useAntecedenteMenu } from '@/presentation/hooks/useAntecedentMenu';
import { createAntecedenteHandlers } from '@/presentation/handlers/useAntecedentHandlers';

interface AntecedenteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (antecedente: AntecedenteCompleto) => Promise<void>;
  antecedente?: AntecedenteCompleto | null;
  pacienteId?: number | null;
  title?: string;
  onAntecedenteAdded?: () => void;
  onAntecedenteUpdated?: () => void;
  onAntecedenteDeleted?: () => void;
  mode?: 'add' | 'view' | 'edit';
}

export default function AntecedenteDialog({
  open,
  onClose,
  onSubmit,
  antecedente,
  pacienteId,
  title = 'Registrar Antecedente',
  onAntecedenteAdded,
  onAntecedenteUpdated,
  onAntecedenteDeleted,
  mode = 'add'
}: AntecedenteDialogProps) {
  // Estados locales
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hooks personalizados
  const {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    currentMode,
    setCurrentMode,
    isReadOnly,
    validateForm,
    resetForm
  } = useAntecedenteForm({ antecedente, pacienteId, mode, open });

  const {
    enfermedadesOptions,
    habitosOptions,
    medicacionesOptions,
    atencionesOptions,
    loading,
    enfermedadSearch,
    habitoSearch,
    medicacionSearch,
    atencionSearch,
    setEnfermedadSearch,
    setHabitoSearch,
    setMedicacionSearch,
    setAtencionSearch,
    fetchOptions,
    fetchEnfermedades,
    fetchHabitos,
    fetchMedicaciones,
    fetchAtencionesMedicas
  } = useAntecedenteOptions();

  const {
    menuAnchorEl,
    menuOpen,
    confirmDialogOpen,
    handleMenuClick,
    handleMenuClose,
    handleEditClick,
    handleDeleteClick,
    setConfirmDialogOpen
  } = useAntecedenteMenu({ setCurrentMode });

  useEffect(() => {
    if (open) {
      fetchOptions().catch(error => {
        console.error('Error cargando opciones:', error);
        setError('Error al cargar datos. Por favor, intente nuevamente.');
      });
    }
  }, [open, fetchOptions]);

  const handleClose = (): void => {
    resetForm();
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handlers = createAntecedenteHandlers({
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    currentMode,
    antecedente,
    validateForm,
    onSubmit,
    onAntecedenteAdded,
    onAntecedenteUpdated,
    onAntecedenteDeleted,
    setError,
    setSuccess,
    setSubmitLoading,
    setDeleteLoading,
    setConfirmDialogOpen,
    handleClose
  });

  const getSelectedEnfermedades = (): Option[] => {
    return enfermedadesOptions.filter(option => 
      formData.enfermedades.includes(option.id)
    );
  };

  const getSelectedHabitos = (): Option[] => {
    return habitosOptions.filter(option => 
      formData.habitos.includes(option.id)
    );
  };

  const getSelectedMedicaciones = (): Option[] => {
    return medicacionesOptions.filter(option => 
      formData.medicaciones.includes(option.id)
    );
  };

  const getSelectedAtenciones = (): Option[] => {
    return atencionesOptions.filter(option => 
      formData.atencionesMedicas.includes(option.id)
    );
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { minHeight: '70vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="div">
            {currentMode === 'edit' ? 'Editar Antecedente' : 
             currentMode === 'view' ? 'Detalles del Antecedente' : 
             title}
          </Typography>
          
          {/* Menú de opciones */}
          {antecedente?.idantecedente && currentMode === 'view' && (
            <IconButton
              aria-label="opciones"
              aria-controls="menu-opciones"
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          
          <Menu
            id="menu-opciones"
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditClick}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Editar
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Eliminar
            </MenuItem>
          </Menu>
        </DialogTitle>
        
        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handlers.handleSubmit}>
              <Grid container spacing={3}>
                {/* Información básica */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Información Básica
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                {/* Fecha */}
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha"
                      value={formData.fecha}
                      onChange={handlers.handleDateChange}
                      sx={{ width: '100%' }}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                  </LocalizationProvider>
                </Grid>
                
                {/* Embarazo y Habilitado */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="embarazo"
                        checked={formData.embarazo}
                        onChange={handlers.handleChange}
                        color="primary"
                        disabled={isReadOnly}
                      />
                    }
                    label="Embarazo"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="habilitado"
                        checked={formData.habilitado}
                        onChange={handlers.handleChange}
                        color="primary"
                        disabled={isReadOnly}
                      />
                    }
                    label="Habilitado"
                  />
                </Grid>
                
                {/* Sección de Enfermedades */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Enfermedades
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="enfermedades"
                    options={enfermedadesOptions}
                    value={getSelectedEnfermedades()}
                    onChange={handlers.handleEnfermedadesChange}
                    onInputChange={(_, value) => {
                      setEnfermedadSearch(value);
                      if (value.length > 2) {
                        fetchEnfermedades(value);
                      }
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Enfermedades"
                        placeholder={isReadOnly ? "" : "Buscar enfermedades"}
                        variant="outlined"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.label}
                          {...getTagProps({ index })}
                          color="primary"
                          variant="outlined"
                          onDelete={isReadOnly ? undefined : getTagProps({ index }).onDelete}
                        />
                      ))
                    }
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </Grid>
                
                {/* Sección de Hábitos */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Hábitos
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="habitos"
                    options={habitosOptions}
                    value={getSelectedHabitos()}
                    onChange={handlers.handleHabitosChange}
                    onInputChange={(_, value) => {
                      setHabitoSearch(value);
                      if (value.length > 2) {
                        fetchHabitos(value);
                      }
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Hábitos"
                        placeholder={isReadOnly ? "" : "Buscar hábitos"}
                        variant="outlined"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.label}
                          {...getTagProps({ index })}
                          color="secondary"
                          variant="outlined"
                          onDelete={isReadOnly ? undefined : getTagProps({ index }).onDelete}
                        />
                      ))
                    }
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </Grid>
                
                {/* Sección de Medicaciones */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Medicaciones
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="medicaciones"
                    options={medicacionesOptions}
                    value={getSelectedMedicaciones()}
                    onChange={handlers.handleMedicacionesChange}
                    onInputChange={(_, value) => {
                      setMedicacionSearch(value);
                      if (value.length > 2) {
                        fetchMedicaciones(value);
                      }
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Medicaciones"
                        placeholder={isReadOnly ? "" : "Buscar medicaciones"}
                        variant="outlined"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.label}
                          {...getTagProps({ index })}
                          color="info"
                          variant="outlined"
                          onDelete={isReadOnly ? undefined : getTagProps({ index }).onDelete}
                        />
                      ))
                    }
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </Grid>
                
                {/* Sección de Atenciones Médicas */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Atenciones Médicas
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="atencionesMedicas"
                    options={atencionesOptions}
                    value={getSelectedAtenciones()}
                    onChange={handlers.handleAtencionesChange}
                    onInputChange={(_, value) => {
                      setAtencionSearch(value);
                      if (value.length > 2) {
                        fetchAtencionesMedicas(value);
                      }
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Atenciones Médicas"
                        placeholder={isReadOnly ? "" : "Buscar atenciones médicas"}
                        variant="outlined"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.label}
                          {...getTagProps({ index })}
                          color="warning"
                          variant="outlined"
                          onDelete={isReadOnly ? undefined : getTagProps({ index }).onDelete}
                        />
                      ))
                    }
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                  />
                </Grid>
              </Grid>
            </form>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            {isReadOnly ? 'Cerrar' : 'Cancelar'}
          </Button>
          
          {!isReadOnly && (
            <Button 
              onClick={handlers.handleSubmit}
              color="primary"
              variant="contained"
              disabled={loading || submitLoading}
              startIcon={submitLoading && <CircularProgress size={20} />}
            >
              {currentMode === 'edit' ? 'Actualizar' : 'Guardar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ConfirmDialogTitle id="alert-dialog-title">
          Confirmar eliminación
        </ConfirmDialogTitle>
        <ConfirmDialogContent>
          <Typography variant="body1">
            ¿Está seguro de que desea eliminar este antecedente? Esta acción no se puede deshacer.
          </Typography>
        </ConfirmDialogContent>
        <ConfirmDialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            color="inherit"
            disabled={deleteLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handlers.handleDelete} 
            color="error" 
            variant="contained"
            autoFocus
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={20} color="inherit" />}
          >
            Eliminar
          </Button>
        </ConfirmDialogActions>
      </ConfirmDialog>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}