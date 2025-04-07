'use client';

import React, { useState, useEffect, useCallback } from 'react';
//===============================================================
// con debounce se evita que la funcion fetchTreatments se ejecute cada vez que
//  el usuario escribe en el input de busqueda, lo que quier decir que funciona 
// como un buscador y filtrado de datos
//===============================================================
import debounce from 'lodash/debounce';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor
} from '@mui/material';
import { Add, Edit, Delete, Restore, DeleteForever } from '@mui/icons-material';

//interfac de tratamientos
import { Treatments } from '@/entities/treatments';
// interface para los mensajes de la snackbar
//  y el color de la alerta
interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatments[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newTreatment, setNewTreatment] = useState<Omit<Treatments, 'idtratamiento' | 'habilitado'>>({
    nombre: '',   
    descripcion: '',
    precio: 0,
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Partial<Treatments> | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const handleSnackbarClose = () => {
    setSnackbar(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };
// aqui es donde se hace la peticion a la api para obtener los tratamientos
//  y se filtran por el nombre del tratamiento
  // y se habilitan o deshabilitan los tratamientos
// se puso como array la informacion recibida para evitar errores
  const fetchTreatments = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      const endpoint = showDisabled 
        ? `/api/treatments/disable?q=${query}` 
        : `/api/treatments?q=${query}`;
      
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Error al cargar tratamientos');
        const data: Treatments[] = await res.json(); 
        setTreatments(Array.isArray(data) ? data : []);
      } catch {
        showMessage('Error al cargar los Tratamientos', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [showDisabled]
  );

  // aca se hace la peticion a la api para obtener los tratamientos
  // pero usando useEffect para que se ejecute cada vez que el usuario
  // escribe en el input de busqueda, sirve como si fuera una recarga automatica
  useEffect(() => {
    fetchTreatments(searchTerm);
    return () => fetchTreatments.cancel();
  }, [searchTerm, fetchTreatments]);

  //esto es para el formaulario temas de disenio e interactividad pero hay que mejorarlo
  const handleOpen = () => {
    setSelectedTreatment(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // este es el evento que se ejecuta cuando el usuario cambia el valor de los inputs
  
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
// y este se encarga de actualizar el estado del formulario
  const resetForm = () => {
    setNewTreatment({
      nombre: '',
      descripcion: '',
      precio: 0,
    });
    setSelectedTreatment(null);
  };
// esto edita el tratamiento seleccionado y lo carga en el formulario
  const handleEdit = (treatment: Treatments) => {
    setNewTreatment({
      nombre: treatment.nombre || '',
      descripcion: treatment.descripcion || '',
      precio: treatment.precio || 0,
    });
    setSelectedTreatment(treatment);
    setOpen(true);
  };

  // esto se encarga de eliminar el tratamiento seleccionado
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/treatments/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();

      setTreatments((prev) => prev.filter((treatment) => treatment.idtratamiento !== id));
      showMessage('Tratamiento eliminado correctamente', 'success');
    } catch {
      showMessage('Error al eliminar el tratamiento', 'error');
    }
  };

    // esto se encarga de restaurar los tratamientos eliminados
  const handleRestore = async (id: number) => {
    try {
      const response = await fetch(`/api/treatments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'restore' }),
      });

      if (!response.ok) throw new Error();
      
      setTreatments((prev) => prev.filter((treatment) => treatment.idtratamiento !== id));
      showMessage('Tratamiento restaurado correctamente', 'success');
    } catch {
      showMessage('Error al restaurar el Tratamiento', 'error');
    }
  };
// esta funcion se encarga de eliminar el tratamiento de forma permanente
  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este producto permanentemente? Esta acción no se puede deshacer.')) return;
    try {
      
      const response = await fetch(`/api/treatments/${id}?type=physical`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error();

      showMessage('Tratamiento eliminado permanentemente', 'success');
      fetchTreatments(searchTerm);
    } catch {
      showMessage('Error al eliminar el Tratamiento', 'error');
    }
  };
 

// esta funcion se encarga de guardar el tratamiento ya sea nuevo o editado
  // y se encarga de validar los campos del formulario
  const handleSubmit = async () => { 
    const trimmedTreatment = {
      nombre: newTreatment.nombre.trim(),
      descripcion: newTreatment.descripcion.trim(),
      precio: newTreatment.precio,
    };

    if (!trimmedTreatment.nombre) {
      showMessage('El nombre del tratamiento es obligatorio', 'error');
      return;
    }

    const isDuplicate = treatments.some(
      treatment => 
        treatment.nombre.toLowerCase().trim() === trimmedTreatment.nombre.toLowerCase() && 
        treatment.idtratamiento !== selectedTreatment?.idtratamiento
    );

    if (isDuplicate) {
      showMessage('El tratamiento ya existe', 'error');
      return;
    }

    try {
      if (selectedTreatment) {
        const response = await fetch(`/api/treatments/${selectedTreatment.idtratamiento}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(trimmedTreatment),
        });
  
        if (response.ok) {
          const updatedTreatment = await response.json();
          setTreatments(prev =>
            prev.map((t) => t.idtratamiento === updatedTreatment.idtratamiento ? updatedTreatment : t)
          );
          showMessage('Tratamiento actualizado correctamente', 'success');
          handleClose();
        } else {
          const errorData = await response.json();
          showMessage(errorData.message || 'Error al actualizar tratamiento', 'error');
        }
      } else {
        const response = await fetch('/api/treatments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trimmedTreatment),
        });
  
        if (response.ok) {
          const addedTreatment = await response.json();
          setTreatments((prev) => [...prev, addedTreatment]);
          showMessage('Tratamiento agregado correctamente', 'success');
          handleClose();
        } else {
          const errorData = await response.json();
          showMessage(errorData.message || 'Error al agregar tratamiento', 'error');
        }
      }
    } catch {
      showMessage('Ocurrió un error inesperado', 'error');
    }
  };

// esta funcion se encarga de mostrar los tratamientos inhabilitados o habilitados
  // y se encarga de limpiar el formulario y el input de busqueda
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

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : treatments.length === 0 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <Typography variant="h6" color="textSecondary">
            {showDisabled 
              ? 'No hay tratamientos inhabilitados' 
              : 'No hay tratamientos disponibles'}
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
{/* aca recomiendo usar array is array para evitar errores cuando se haga 
la comprobacion de no haya datos vacios asi en ves de que muestre error mostrara que no se encontro datos del lado del else */}
            <TableBody>
                {Array.isArray(treatments) && treatments.length > 0 ? (
        treatments.map((treatment) => (

                <TableRow key={treatment.idtratamiento}>
                  <TableCell>{treatment.idtratamiento}</TableCell>
                  <TableCell>{treatment.nombre}</TableCell>
                  <TableCell>{treatment.descripcion}</TableCell>
                  <TableCell>BS. {Number(treatment.precio).toFixed(2)}</TableCell>

                  <TableCell>
                    {!showDisabled ? (
                      <>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEdit(treatment)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(treatment.idtratamiento)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleRestore(treatment.idtratamiento)}
                          title="Restaurar Tratamiento"
                        >
                          <Restore />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeletePermanently(treatment.idtratamiento)}
                          title="Eliminar Permanentemente"
                        >
                          <DeleteForever />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay tratamientos disponibles
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
{/* los dialogs son los formularios flotantes que aparecen cuando se quiere editar o agregar un tratamiento son GOOOOOOOOODS  */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedTreatment ? 'Editar Tratamiento' : 'Añadir Tratamiento'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            margin="dense"
            value={newTreatment.nombre}
            onChange={handleChange}
            required
          />
          <TextField
            label="Descripción"
            name="descripcion"
            fullWidth
            margin="dense"
            value={newTreatment.descripcion}
            onChange={handleChange}
          />
          <TextField
            label="Precio"
            name="precio"
            type="number"
            fullWidth
            margin="dense"
            value={newTreatment.precio}
            onChange={handleChange}
            InputProps={{
              startAdornment: 'Bs '
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTreatment ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
{/* y finalmente este es el snack que aparece cuando se agrega, edita o elimina un tratamiento como mensaje de confirmacion */}
      {snackbar && (
        <Snackbar 
          open={true}
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}