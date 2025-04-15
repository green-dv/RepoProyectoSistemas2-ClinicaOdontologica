"use client";
import { useEffect } from 'react';
import moment from 'moment';
import { Add } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete
} from '@mui/material';

import DateCard from '@/components/dates/DateCard';
import { Status } from '@/domain/entities/Status'
import ToggleButtonGroupComponent from '@/components/calendar/ToggleButtonGroup';
import SnackbarAlert from '@/components/SnackbarAlert';
import DatesDialog from './DatesDialog';

import useDates from '@/presentation/hooks/useDate';
import useDatesHandlers from '@/presentation/handlers/useDateHandler';
import StatusDropDown from './StatusDropDown';
import { Patient } from '@/domain/entities/Patient';
import { fetchStatus } from '@/application/usecases/status'
import { createPatientFetcher } from '@/presentation/handlers/patientsUtil';
export function DatesComponent() {
  const [filter, setFilter] = useState<string>('todas');
  
  const datesState = useDates();

  const {
    handleFetchDates,
    handleOpen,
    handleChange,
    handleClose,
    handleEdit,
    handleDelete,
    handleRestore,
    handleDeletePermanently,
    handleSubmit,
    toggleView,
    handleSnackbarClose,
    handleDatesFilter,
    setPacienteId,
    setFechaFin,
    setFechaInicio,
    setEstadoFiltro
  } = useDatesHandlers(datesState);

  const {
    dates,
    searchTerm,
    showDisabled,
    isLoading,
    open,
    snackbar,
    newDate,
    selectedDate,
    pacienteId,
    fechaFin,
    fechaInicio,
    estadoFiltro
  } = datesState;
  const [filteredDates, setFilteredDates] = useState(dates);
  const [statusList, setStatus] = useState<Status[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const fetchPatients = useMemo(() => createPatientFetcher(setPatients), []);
  useEffect(() => {
    handleFetchDates(searchTerm);
    return () => handleFetchDates.cancel();
  }, [searchTerm, handleFetchDates]);
  
  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = await fetchStatus();
      setStatus(statuses);
    };
    
  
    fetchStatuses();
  }, []);

  useEffect(() => {
    const resultadosFiltrados = handleDatesFilter();
    setFilteredDates(resultadosFiltrados);
  }, [dates, estadoFiltro, pacienteId, fechaInicio, fechaFin]);
  

  const today = moment().startOf('day');
  const in7Days = moment().add(7, 'days').endOf('day');

  const citasProximas = filteredDates.filter(date =>
    moment(date.fechacita).isBetween(today, in7Days, undefined, '[]')
  );

  const citasFuturas = filteredDates.filter(date =>
    moment(date.fechacita).isAfter(in7Days)
  );

  const citasPasadas = filteredDates.filter(date =>
    moment(date.fechacita).isBefore(today)
  );
  const secciones = [
    {
      id: 'proximas',
      title: 'Citas en los próximos 7 días',
      dates: citasProximas,
      show: filter === 'todas' || filter === 'proximas'
    },
    {
      id: 'futuras',
      title: 'Citas posteriores',
      dates: citasFuturas,
      show: filter === 'todas' || filter === 'futuras'
    },
    {
      id: 'pasadas',
      title: 'Citas pasadas',
      dates: citasPasadas,
      show: filter === 'todas' || filter === 'pasadas'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button variant="outlined" color="primary" onClick={toggleView}>
            {showDisabled ? 'Ver Habilitados' : 'Ver Inhabilitados'}
          </Button>
          {!showDisabled && (
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
              Añadir Cita
            </Button>
          )}
          <ToggleButtonGroupComponent />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }} mb={3}>
          <Button variant={filter === 'todas' ? 'contained' : 'outlined'} onClick={() => setFilter('todas')}>
            Todas
          </Button>
          <Button variant={filter === 'proximas' ? 'contained' : 'outlined'} onClick={() => setFilter('proximas')}>
            Próximas
          </Button>
          <Button variant={filter === 'futuras' ? 'contained' : 'outlined'} onClick={() => setFilter('futuras')}>
            Futuras
          </Button>
          <Button variant={filter === 'pasadas' ? 'contained' : 'outlined'} onClick={() => setFilter('pasadas')}>
            Pasadas
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
          <Autocomplete
            sx={{ width: '200px' }}
            options={patients}
            getOptionLabel={(option) => `${option.nombres} ${option.apellidos}`}
            onInputChange={(_, value) => {
              fetchPatients(value);
            }}
            onChange={(_, value) => {
              setPacienteId(value ? value.idpaciente : null);
            }}
            
            renderInput={(params) => <TextField {...params} label="Buscar Paciente" />}
            isOptionEqualToValue={(option, value) => option.idpaciente === value.idpaciente}
          />

          <Box sx={{ maxWidth: '200px', width: '100%' }}>
            <StatusDropDown
              isDropDownLoading={false}
              status={statusList} // Array of statuses
              selectedStatus={estadoFiltro ?? 0}
              onChange={(idcita, newStatus) => {
                setEstadoFiltro(newStatus === 0 ? null : newStatus);
              }}
              isFilter={true}
            />
          </Box>

          <TextField
            label="Fecha Inicio"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fechaInicio ? fechaInicio.format('YYYY-MM-DD') : ''}
            onChange={(e) => setFechaInicio(e.target.value ? moment(e.target.value) : null)}
          />

          <TextField
            label="Fecha Fin"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fechaFin ? fechaFin.format('YYYY-MM-DD') : ''}
            onChange={(e) => setFechaFin(e.target.value ? moment(e.target.value) : null)}
          />

          <Button variant="outlined" onClick={() => {
            const resultadosFiltrados = dates.filter(cita => {
              const fecha = moment(cita.fechacita);
              const coincideEstado = estadoFiltro !== null ? Number(cita.idestado) === estadoFiltro : true;
              const coincideFechaInicio = fechaInicio ? fecha.isSameOrAfter(fechaInicio, 'day') : true;
              const coincideFechaFin = fechaFin ? fecha.isSameOrBefore(fechaFin, 'day') : true;
              const coincidePaciente = pacienteId !== null ? Number(cita.idpaciente) === pacienteId : true;
              return coincideEstado && coincideFechaInicio && coincideFechaFin && coincidePaciente;
            });
            setFilteredDates(resultadosFiltrados); // Nuevo estado
          }}>
            Aplicar filtros
          </Button>
        </Box>
        {secciones
          .filter(section => section.show)
          .map(section => (
            <Paper key={section.id} elevation={24} sx={{ mb: 3, p: 2 }}>
              <Typography variant="h5" component="h2" mb={2}>
                {section.title}
              </Typography>
              <DateCard
                dates={section.dates}
                isLoading={isLoading}
                showDisabled={showDisabled}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onDeletePermanently={handleDeletePermanently}
                onUpdate={() => handleFetchDates(searchTerm)}
              />
            </Paper>
        ))}
      </Paper>

      <DatesDialog
        patients={patients}
        fetchPatients={createPatientFetcher(setPatients)}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        date={newDate}
        handleChange={handleChange}
        isEditing={!!selectedDate}
      />

      <SnackbarAlert
        snackbar={snackbar}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default DatesComponent;
