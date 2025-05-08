import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  Alert,
  Skeleton,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Visibility as VisibilityIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
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
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleToggleDisabled = () => {
    setShowDisabled(!showDisabled);
  };

  // Filter patients based on their enabled status
  const filteredPatients = showDisabled
    ? patients.filter(p => !p.habilitado)
    : patients.filter(p => p.habilitado);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No registrada';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha inválida';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
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

      {/* Search and filters row */}
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

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de pacientes">
          <TableHead>
            <TableRow>
              <TableCell>Nombre completo</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Fecha de nacimiento</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton variant="text" width="80%" height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="50%" height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="40%" height={24} />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
                      <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" sx={{ py: 3, color: 'text.secondary' }}>
                    {searchQuery.trim() !== '' 
                      ? 'No se encontraron pacientes que coincidan con la búsqueda'
                      : showDisabled 
                        ? 'No hay pacientes inactivos'
                        : 'No hay pacientes registrados'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // Actual data
              filteredPatients.map((patient) => (
                <TableRow key={patient.idpaciente}>
                  <TableCell component="th" scope="row">
                    {patient.nombres} {patient.apellidos}
                  </TableCell>
                  <TableCell>
                    {patient.telefonopersonal || 'No registrado'}
                  </TableCell>
                  <TableCell>
                    {formatDate(patient.fechanacimiento)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={patient.habilitado ? 'Activo' : 'Inactivo'} 
                      color={patient.habilitado ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => onViewPatient(patient)}
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar paciente">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEditPatient(patient)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar paciente">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDeletePatient(patient)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalPatients}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Box>
  );
};