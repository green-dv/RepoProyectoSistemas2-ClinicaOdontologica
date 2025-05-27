import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Patient } from '@/domain/entities/Patient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  totalPatients: number;
  page: number;
  rowsPerPage: number;
  searchQuery: string;
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onRefresh: () => void;
  onCreatePatient: () => void;
}

// Función para generar los colores de los avatares
function stringToColor(string: string) {
  let hash = 0;
  let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

// Función para generar avatar como de temas
function getAvatarProps(name: string) {
  // primero se divide los nombres en partes
  // y se eliminan los espacios en blanco
  const nameParts = name.trim().split(' ');
  let initials = '';
  
  // aca se obtiene la primera letra del nombre
  if (nameParts.length > 0 && nameParts[0]) {
    initials += nameParts[0][0] || '';
  }
  
  // aca se obtiene la primera letra del apellido
  if (nameParts.length > 1 && nameParts[1]) {
    initials += nameParts[1][0] || '';
  }
  
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials.toUpperCase(),
  };
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  loading,
  error,
  totalPatients,
  page,
  rowsPerPage,
  searchQuery,
  onViewPatient,
  onEditPatient,
  onDeletePatient,
  onSearchChange,
  onPageChange,
  onRowsPerPageChange,
  onRefresh,
  onCreatePatient
}) => {
  const [showDisabled, setShowDisabled] = useState<boolean>(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage - 1); 
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    onRowsPerPageChange(Number(event.target.value));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleToggleDisabled = () => {
    setShowDisabled(!showDisabled);
  };

  const filteredPatients = showDisabled
    ? patients.filter(p => !p.habilitado)
    : patients.filter(p => p.habilitado);

  // formatear la fecha y cambiar a español
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No registrada';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha inválida';
    }
  };

  // Para calcular el número total de páginas
  const totalPages = Math.ceil(totalPatients / rowsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 0 }}>
          Lista de Pacientes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onCreatePatient}
          >
            Nuevo Paciente
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filtros de búsqueda */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Buscar pacientes"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ width: '120px' }}>
            <InputLabel id="rows-per-page-label">Mostrar</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              label="Mostrar"
              onChange={handleChangeRowsPerPage}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={showDisabled}
                onChange={handleToggleDisabled}
                color="primary"
              />
            }
            label="Mostrar inactivos"
          />
        </Box>
      </Box>

      {/* Patient List y el skeleton para la vista */}
      <Paper sx={{ width: '100%', mb: 2, p: 0 }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {loading ? (
            Array.from(new Array(rowsPerPage)).map((_, index) => (
              <React.Fragment key={`skeleton-${index}`}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton variant="text" width="70%" height={28} />}
                    secondary={
                      <>
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="text" width="60%" height={20} />
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                  </Box>
                </ListItem>
                {index < rowsPerPage - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))
          ) : filteredPatients.length === 0 ? (
            <ListItem sx={{ justifyContent: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {searchQuery.trim() !== ''
                  ? 'No se encontraron pacientes que coincidan con la búsqueda'
                  : showDisabled
                    ? 'No hay pacientes inactivos'
                    : 'No hay pacientes registrados'}
              </Typography>
            </ListItem>
          ) : (
            // Actual patient data
            filteredPatients.map((patient, index) => (
              <React.Fragment key={patient.idpaciente}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          edge="end"
                          size="small"
                          color="info"
                          onClick={() => onViewPatient(patient)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar paciente">
                        <IconButton
                          edge="end"
                          size="small"
                          color="primary"
                          onClick={() => onEditPatient(patient)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar paciente">
                        <IconButton
                          edge="end"
                          size="small"
                          color="error"
                          onClick={() => onDeletePatient(patient)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      alt={`${patient.nombres} ${patient.apellidos}`}
                      {...getAvatarProps(`${patient.nombres} ${patient.apellidos}`)}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" component="span">
                          {`${patient.nombres} ${patient.apellidos}`}
                        </Typography>
                        <Chip
                          label={patient.habilitado ? 'Activo' : 'Inactivo'}
                          color={patient.habilitado ? 'success' : 'error'}
                          size="small"
                          sx={{ height: 24 }}
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                          <strong>Teléfono:</strong> {patient.telefonopersonal || 'No registrado'}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                          <strong>Fecha de nacimiento:</strong> {formatDate(patient.fechanacimiento)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < filteredPatients.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Paginacion */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Pagination
          count={totalPages}
          page={page + 1} // MUI Pagination esta en -1 por lo cual +1 good
          onChange={handleChangePage}
          color="primary"
          showFirstButton
          showLastButton
          disabled={loading || totalPatients === 0}
        />
      </Box>
    </Box>
  );
};