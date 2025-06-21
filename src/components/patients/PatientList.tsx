import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Skeleton,
  SelectChangeEvent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  Restore as RestoreIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Patient } from '@/domain/entities/Patient';
import { getConditionalAvatarProps } from '@/presentation/config/avatarsTeams';

// Header Component
interface PatientListHeaderProps {
  title: string;
  showDisabled: boolean;
  loading: boolean;
  onRefresh: () => void;
  onCreatePatient: () => void;
}

export const PatientListHeader: React.FC<PatientListHeaderProps> = ({
  title,
  showDisabled,
  loading,
  onRefresh,
  onCreatePatient,
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 0 }}>
      {title}
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
      {!showDisabled && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreatePatient}
        >
          Nuevo Paciente
        </Button>
      )}
    </Box>
  </Box>
);

interface PatientListFiltersProps {
  searchQuery: string;
  searchPlaceholder: string;
  rowsPerPage: number;
  showDisabled: boolean;
  loading: boolean;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
  onToggleDisabled: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PatientListFilters: React.FC<PatientListFiltersProps> = ({
  searchQuery,
  searchPlaceholder,
  rowsPerPage,
  showDisabled,
  loading,
  onSearchChange,
  onRowsPerPageChange,
  onToggleDisabled,
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <TextField
      label={searchPlaceholder}
      variant="outlined"
      size="small"
      value={searchQuery}
      onChange={onSearchChange}
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
          onChange={onRowsPerPageChange}
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
            onChange={onToggleDisabled}
            color="primary"
            disabled={loading}
          />
        }
        label="Mostrar inactivos"
      />
    </Box>
  </Box>
);

// Patient Item Component
interface PatientListItemProps {
  patient: Patient;
  showDisabled: boolean;
  formatDate: (date: string) => string;
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
  onRestorePatient?: (patient: Patient) => void;
  onDeletePermanently?: (patient: Patient) => void;
}

export const PatientListItem: React.FC<PatientListItemProps> = ({
  patient,
  showDisabled,
  formatDate,
  onViewPatient,
  onEditPatient,
  onDeletePatient,
  onRestorePatient,
  onDeletePermanently,
}) => {
  const fullName = `${patient.nombres} ${patient.apellidos}`;
  const avatarProps = getConditionalAvatarProps(fullName, showDisabled);

  const renderActionButtons = () => {
    if (showDisabled) {
      // Vista de pacientes inhabilitados: mostrar botones de restaurar y eliminar permanentemente
      return (
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
          <Tooltip title="Restaurar paciente">
            <IconButton
              edge="end"
              size="small"
              color="success"
              onClick={() => onRestorePatient?.(patient)}
            >
              <RestoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar permanentemente">
            <IconButton
              edge="end"
              size="small"
              color="error"
              onClick={() => onDeletePermanently?.(patient)}
            >
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    } else {
      // Vista de pacientes activos: botones normales
      return (
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
          <Tooltip title="Deshabilitar paciente">
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
      );
    }
  };

  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={renderActionButtons()}
    >
      <ListItemAvatar>
        <Avatar alt={fullName} {...avatarProps} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="subtitle1" 
              component="span"
              sx={{ 
                opacity: showDisabled ? 0.7 : 1,
                textDecoration: showDisabled ? 'line-through' : 'none'
              }}
            >
              {fullName}
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
            <Typography 
              component="span" 
              variant="body2" 
              sx={{ 
                display: 'block',
                opacity: showDisabled ? 0.7 : 1
              }}
            >
              <strong>Teléfono:</strong> {patient.telefonopersonal || 'No registrado'}
            </Typography>
            <Typography 
              component="span" 
              variant="body2" 
              sx={{ 
                display: 'block',
                opacity: showDisabled ? 0.7 : 1
              }}
            >
              <strong>Fecha de nacimiento:</strong> {formatDate(patient.fechanacimiento)}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

// Skeleton Loading Component
interface PatientListSkeletonProps {
  rowsPerPage: number;
}

export const PatientListSkeleton: React.FC<PatientListSkeletonProps> = ({ rowsPerPage }) => (
  <>
    {Array.from(new Array(rowsPerPage)).map((_, index) => (
      <ListItem key={`skeleton-${index}`} alignItems="flex-start">
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
    ))}
  </>
);

// Empty State Component
interface PatientListEmptyStateProps {
  message: string;
}

export const PatientListEmptyState: React.FC<PatientListEmptyStateProps> = ({ message }) => (
  <ListItem sx={{ justifyContent: 'center', py: 4 }}>
    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
      {message}
    </Typography>
  </ListItem>
);

// Error Alert Component
interface PatientListErrorProps {
  error: string;
}

export const PatientListError: React.FC<PatientListErrorProps> = ({ error }) => (
  <Alert severity="error" sx={{ mb: 3 }}>
    {error}
  </Alert>
);