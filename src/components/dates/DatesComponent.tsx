"use client";
import moment from 'moment';
import { Add, Clear, Search } from '@mui/icons-material';
import { 
  useState, 
  useEffect 
} from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
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
    setEstadoFiltro,
    //PACIENTES
    handlePatientSelect,
    handleClearSearch, 

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
    estadoFiltro,

    searchQuery,
    debouncedSearchQuery,
    patients,
    selectedPatient,
    loading,
    searchLoading,
    error,
    setSearchQuery,
    setDebouncedSearchQuery,
    setPatients,
    setSelectedPatient,
    setLoading,
    setSearchLoading,
    setError,
    shouldSearch,
    setShouldSearch,
  } = datesState;
  const [filteredDates, setFilteredDates] = useState(dates);
  const [statusList, setStatus] = useState<Status[]>([]);
  useEffect(() => {
      handleFetchDates(searchTerm);
      return () => handleFetchDates.cancel();
    }, [searchTerm, handleFetchDates]);

  useEffect(() => {
    const citasFiltradas = handleDatesFilter();
    setFilteredDates(citasFiltradas);
  }, [dates, estadoFiltro, fechaInicio, fechaFin, pacienteId]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = await fetchStatus();
      setStatus(statuses);
    };
    fetchStatuses();
  }, []);
  

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
          <Box className="no-print" position="relative" sx={{ width: '100%', maxWidth: 300 }}>
          <TextField
            fullWidth
            placeholder="Buscar paciente por nombre, apellido o id..."
            value={searchQuery}
            onChange={(e) => {
              setShouldSearch(true);
              setSearchQuery(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchLoading && <CircularProgress size={20} />}
                  {searchQuery && (
                    <IconButton onClick={handleClearSearch} size="small">
                      <Clear />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Lista de pacientes encontrados */}
          {patients.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: 300,
                overflow: 'auto',
                mt: 1,
              }}
            >
              {patients.map((patient) => (
                <Box
                  key={patient.idpaciente}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => {
                    handlePatientSelect(patient);        // ← tu lógica para selección
                    setPacienteId(Number(patient.idpaciente) ?? null);   // ← filtro en citas
                    setSearchQuery(`${patient.nombres} ${patient.apellidos}`); // opcional: mostrar nombre en input
                    setPatients([]);                     // opcional: cerrar dropdown
                  }}
                >
                  <Typography variant="body1" fontWeight="medium">
                    {patient.nombres} {patient.apellidos}
                  </Typography>
                </Box>
              ))}
            </Paper>
              )}
            </Box>
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPatient={selectedPatient}
        searchLoading={searchLoading}
        handlePatientSelect={handlePatientSelect}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        date={newDate}
        handleChange={handleChange}
        isEditing={!!selectedDate}
        setSelectedPatient={setSelectedPatient}
      />

      <SnackbarAlert
        snackbar={snackbar}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default DatesComponent;
