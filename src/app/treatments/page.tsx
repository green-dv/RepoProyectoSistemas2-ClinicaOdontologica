'use client';

import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
  styled,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Collapse,
  Divider,
  //
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, Edit, Delete, Restore, DeleteForever, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { red, green } from '@mui/material/colors';
import { Treatment } from '@/domain/entities/Treatments';
import { IconButtonProps } from '@mui/material/IconButton';

interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newTreatment, setNewTreatment] = useState<Omit<Treatment, 'idtratamiento' | 'habilitado'>>({
    nombre: '',   
    descripcion: '',
    precio: 0,
  });
  const [showDisabled, setShowDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Partial<Treatment> | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const handleSnackbarClose = () => {
    setSnackbar(null);
  };

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  const fetchTreatments = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      const endpoint = showDisabled 
        ? `/api/treatments/disable?q=${query}` 
        : `/api/treatments?q=${query}`;
      
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Error al cargar tratamientos');
        const data: Treatment[] = await res.json(); 
        setTreatments(Array.isArray(data) ? data : []);
        
        // Reset expanded cards when treatments change
        setExpandedCards({});
      } catch {
        showMessage('Error al cargar los Tratamientos', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [showDisabled]
  );

  useEffect(() => {
    fetchTreatments(searchTerm);
    return () => fetchTreatments.cancel();
  }, [searchTerm, fetchTreatments]);

  const handleOpenDialog = () => {
    setSelectedTreatment(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
    setOpenDialog(true);
  };

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
          handleCloseDialog();
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
          handleCloseDialog();
        } else {
          const errorData = await response.json();
          showMessage(errorData.message || 'Error al agregar tratamiento', 'error');
        }
      }
    } catch {
      showMessage('Ocurrió un error inesperado', 'error');
    }
  };

  const toggleView = () => {
    setShowDisabled((prev) => !prev);
    setTreatments([]); 
    setSearchTerm(''); 
  };

  const handleExpandClick = (id: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 2 }}>
        Gestión de Tratamientos
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField 
          label="Buscar tratamiento..." 
          fullWidth 
          variant="outlined"
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 400, mr: 2 }}
        />
        
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={toggleView}
            sx={{ mr: 2 }}
          >
            {showDisabled ? 'Ver Habilitados' : 'Ver Inhabilitados'}
          </Button>
          {!showDisabled && (
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={handleOpenDialog}
            >
              Añadir Tratamiento
            </Button>
          )}
        </Box>
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
        <Grid container spacing={3}>
          {treatments.map((treatment) => (
            <Grid item xs={12} sm={6} md={4} key={treatment.idtratamiento}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ 
                      bgcolor: showDisabled ? red[500] : green[500],
                      width: 40, 
                      height: 40,
                      fontSize: '1.2rem'
                    }}>
                      {treatment.nombre.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  action={
                    !showDisabled ? (
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(treatment)}
                      >
                        <Edit />
                      </IconButton>
                    ) : null
                  }
                  title={treatment.nombre}
                  subheader={`BS. ${Number(treatment.precio).toFixed(2)}`}
                  titleTypographyProps={{ variant: 'h6' }}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {treatment.descripcion || 'Sin descripción'}
                  </Typography>
                </CardContent>
                
                <Divider />
                
                <CardActions disableSpacing>
                  {!showDisabled ? (
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(treatment.idtratamiento)}
                    >
                      <Delete />
                    </IconButton>
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
                  
                  <ExpandMore
                    expand={expandedCards[treatment.idtratamiento] || false}
                    onClick={() => handleExpandClick(treatment.idtratamiento)}
                    aria-expanded={expandedCards[treatment.idtratamiento] || false}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                
                <Collapse in={expandedCards[treatment.idtratamiento] || false} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph sx={{ fontWeight: 'bold' }}>Detalles:</Typography>
                    <Typography paragraph>
                      {treatment.descripcion || 'No hay descripción detallada'}
                    </Typography>
                    <Typography>
                      <strong>ID:</strong> {treatment.idtratamiento}
                    </Typography>
                    <Typography>
                      <strong>Estado:</strong> {showDisabled ? 'Inhabilitado' : 'Habilitado'}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
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
            sx={{ mt: 2 }}
          />
          <TextField
            label="Descripción"
            name="descripcion"
            fullWidth
            margin="dense"
            multiline
            rows={3}
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
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTreatment ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

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