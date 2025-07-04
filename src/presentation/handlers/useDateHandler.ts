import { useCallback, useEffect } from "react";
import debounce from 'lodash/debounce';
import { Date as DateObj, DateDTO } from "@/domain/entities/Dates";
import { AlertColor } from "@mui/material";
import moment from 'moment';
import{
  fetchDates,
  createDate,
  updateDate,
  deleteDate,
  restoreDate,
  deleteDatePermanently
} from '@/application/usecases/dates';
import { Patient } from "@/domain/entities/Patient";
import { PatientResponse } from "@/domain/dto/patient";

interface DatesState{
  dates: DateObj[];
  open: boolean;
  searchTerm: string;
  newDate: DateDTO;
  showDisabled: boolean;
  isLoading: boolean;
  selectedDate: DateObj | null;
  snackbar: { message: string, severity: AlertColor } | null;
  estadoFiltro: number | null;
  fechaInicio: moment.Moment | null;
  fechaFin: moment.Moment | null;
  pacienteId: number | null;

  //PACIENTES
  searchQuery: string | '';
  debouncedSearchQuery: string | '';
  patients: Patient[] | [];
  selectedPatient: Patient | null;
  loading: boolean | false;
  searchLoading: boolean | false;
  error: string | null;
  shouldSearch: boolean;

  //INSERCION/EDICION PACIENTES
  searchQueryDialog: string | '';
  debouncedSearchQueryDialog: string | '';
  patientsDialog: Patient[] | [];
  selectedPatientDialog: Patient | null;
  loadingDialog: boolean | false;
  searchLoadingDialog: boolean | false;
  errorDialog: string | null;
  shouldSearchDialog: boolean;
  pacienteIDDialog: number | null;

  setDates: React.Dispatch<React.SetStateAction<DateObj[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewDate: React.Dispatch<React.SetStateAction<DateDTO>>;
  setShowDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateObj | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<{ message: string, severity: AlertColor } | null>>;

  setEstadoFiltro: React.Dispatch<React.SetStateAction<number | null>>;
  setFechaInicio: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setFechaFin: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
  setPacienteId: React.Dispatch<React.SetStateAction<number | null>>;

  //PACIENTES
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setDebouncedSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setSelectedPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setShouldSearch: React.Dispatch<React.SetStateAction<boolean>>;

  setSearchQueryDialog: React.Dispatch<React.SetStateAction<string>>;
  setDebouncedSearchQueryDialog: React.Dispatch<React.SetStateAction<string>>;
  setPatientsDialog: React.Dispatch<React.SetStateAction<Patient[]>>;
  setSelectedPatientDialog: React.Dispatch<React.SetStateAction<Patient | null>>;
  setLoadingDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchLoadingDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorDialog: React.Dispatch<React.SetStateAction<string | null>>;
  setShouldSearchDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setPacienteIdDialog: React.Dispatch<React.SetStateAction<number | null>>;

  timeError: boolean,
  patientError: boolean,
  descriptionError: boolean,
  accordedTimeError: boolean,
  aproximateTimeError: boolean,

  setAproximateTimeError: React.Dispatch<React.SetStateAction<boolean>>;
  setAccordedTimeError: React.Dispatch<React.SetStateAction<boolean>>;
  setDescriptionError: React.Dispatch<React.SetStateAction<boolean>>;
  setPatientError: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeError: React.Dispatch<React.SetStateAction<boolean>>;

  resetForm: () => void;
  showMessage: (message: string, severity: AlertColor) => void;

}

export default function useDatesHandlers(state: DatesState){
  const{
    dates,
    searchTerm,
    selectedDate,
    newDate,
    showDisabled,
    estadoFiltro,
    fechaInicio,
    fechaFin,
    pacienteId,
    setDates,
    setIsLoading,
    setOpen,
    setSelectedDate,
    resetForm,
    showMessage,
    setEstadoFiltro,
    setFechaInicio,
    setFechaFin,
    setPacienteId,
    //PACIENTES
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
    setSearchLoading,
    setError,
    shouldSearch,

    searchQueryDialog,
    debouncedSearchQueryDialog,
    patientsDialog,
    selectedPatientDialog,
    loadingDialog,
    searchLoadingDialog,
    errorDialog,
    setSearchQueryDialog,
    setDebouncedSearchQueryDialog,
    setPatientsDialog,
    setSelectedPatientDialog,
    setLoadingDialog,
    setSearchLoadingDialog,
    setErrorDialog,
    shouldSearchDialog,
    setShouldSearchDialog,
    setPacienteIdDialog,

    timeError, setTimeError,
    patientError, setPatientError,
    descriptionError, setDescriptionError,
    accordedTimeError, setAccordedTimeError,
    aproximateTimeError, setAproximateTimeError,
  } = state;


  const handleSnackbarClose = () => {
    state.setSnackbar(null);
  };
  const handleFetchDates = useCallback(
    debounce(async (query: string) => {
        setIsLoading(true);
        try {
            const data: DateObj[] = await fetchDates(query, showDisabled);
            setDates(data);
            const ev = data.map((data) => {
                const start = moment(data.fechacita).toDate(); 
                const end = new Date(start.getTime() + data.duracionaprox * 60 * 60 * 1000); 
                return {
                    title: data.descripcion,
                    start,
                    end,
                };
            });
            return ev;
        } catch {
            showMessage('Error al cargar las citas', 'error');
        } finally {
            setIsLoading(false);
        }
    }, 300),
    [showDisabled]
  );

  const handleOpen = () => {
    
    setSelectedDate(null);
    setOpen(true);
  };

  const handleClose = () => {
    setTimeError(false);
    setPatientError(false);
    setDescriptionError(false);
    setAccordedTimeError(false);
    setAproximateTimeError(false);
    setOpen(false);
    setSearchQueryDialog('');
    resetForm();
  };

  const handleEdit = (date: DateObj) => {
    state.setNewDate({
      fecha: date.fecha ? moment(date.fecha).format('YYYY-MM-DDTHH:mm') : '',   
      idpaciente: date.idpaciente || 1,
      idconsulta: date.idconsulta ?? 0,
      descripcion: date.descripcion || '',
      idestadocita: 1,
      fechacita: date.fechacita ? moment(date.fechacita).format('YYYY-MM-DDTHH:mm') : '',
      duracionaprox: date.duracionaprox || 0
    });

    // Buscar paciente actual para mostrarlo en el input (opcional)
    const paciente = patients.find(p => p.idpaciente === date.idpaciente);
    if (paciente) {
      setSearchQueryDialog(`${paciente.nombres} ${paciente.apellidos}`);
      setSelectedPatient(paciente);
    }
    setSearchQueryDialog(date.paciente);
    console.log(date.paciente);
    setSelectedDate(date);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDate(id);
      setDates((prev) => prev.filter((date) => date.idcita !== id));
      showMessage('Cita eliminada correctamente', 'success');
    } catch {
      showMessage('Error al eliminar la cita', 'error');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreDate(id);
      setDates((prev) => prev.filter((date) => date.idcita !== id));
      showMessage('Cita restaurada correctamente', 'success');
    } catch {
      showMessage('Error al restaurar la cita', 'error');
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este producto permanentemente? no hay vuelta atras.')) return;
    try {
      await deleteDatePermanently(id);
      showMessage('Cita eliminada permanentemente', 'success');
      handleFetchDates(searchTerm);
    } catch {
      showMessage('Error al eliminar la cita', 'error');
    }
  };

  const handleSubmit = async () => { 
    setTimeError(false);
    setAccordedTimeError(false);
    setPatientError(false);
    setDescriptionError(false);
    setAproximateTimeError(false);
    try {
      const adjustedFecha = moment(newDate.fecha).subtract(4, 'hours').toISOString();
      const adjustedFechacita = moment(newDate.fechacita).subtract(4, 'hours').toISOString();
      const adjustedNewDate = {
          ...newDate,
          fecha: adjustedFecha,
          fechacita: adjustedFechacita
      };

      const start = moment(newDate.fechacita);
      const end = start.clone().add(newDate.duracionaprox * 60, 'minutes');

      const appointmentHour = start.hour();
      const isOutOfHours = appointmentHour < 7 || appointmentHour >= 22;
      const nextDay = end.hour() >= 22;

      const isRegisteredDateDuplicated = dates.some(
        date => 
          date.fechacita === newDate.fechacita
      );
      if(newDate.descripcion.length > 100){
        showMessage('La descripcion no puede tener mas de 100 caracteres', 'error');
        setDescriptionError(true);
        return;
      }
      const isRegisteredAppointmentDuplicated = dates.some(
        date => 
          Number(date.idconsulta) === Number(newDate.idconsulta) && Number(newDate.idconsulta!= null) && Number(newDate.idconsulta != 0)
      );
      const citasParaComparar = selectedDate
        ? dates.filter(date => date.idcita !== selectedDate.idcita)
        : dates;

      const isOverlapping = citasParaComparar.some(date => {
        const start = moment(date.fechacita);
        const end = moment(date.fechacita).add(date.duracionaprox * 60, 'minutes');
        const newStart = moment(newDate.fechacita);
        const newEnd = moment(newDate.fechacita).add(newDate.duracionaprox * 60, 'minutes');

        return newStart.isBefore(end) && start.isBefore(newEnd);
      });

      const isRegisterDateValid = moment(newDate.fecha) > moment(Date.now()).add(-1, 'year');
      
      if(newDate.duracionaprox > 5){
        showMessage('La duración aproximada no puede ser mayor a 5 horas', 'error');
        setAproximateTimeError(true);
        return;
      }
      if(nextDay){
        showMessage('No se puede trabajar hasta luego de las 10pm', 'error');
        setAccordedTimeError(true);
        return;
      }
      if(newDate.duracionaprox < 0.25){
        showMessage('La duración aproximada no puede ser menor a 15 minutos', 'error');
        setAproximateTimeError(true);
        return;
      }
      if(isOutOfHours){
        showMessage('La hora ingresada no puede ser antes de las 7 am ni despues de las 10 pm', 'error');
        setAccordedTimeError(true);
        return;
      }
      if (isOverlapping) {
        showMessage('Ya hay una cita registrada durante esta hora', 'error');
        setAccordedTimeError(true);
        return;
      }
      if(isRegisteredDateDuplicated){
        setTimeError(true);
        setAccordedTimeError(true);
        showMessage('Ya hay una cita registrada para esta fecha', 'error');
        return;
      }
      if(!isRegisterDateValid){
        setTimeError(true);
        showMessage('La fecha ingresada es muy antigua', 'error');
        return;
      }
      if(isRegisteredAppointmentDuplicated){
        setAccordedTimeError(true);
        showMessage('Ya hay una cita registrada para esta consulta', 'error');
        return;
      }
      if(newDate.duracionaprox <= 0){
        setAproximateTimeError(true);
        showMessage('Ingrese una duración aproximada correcta', 'error');
        return;
      }
      if(!selectedDate){
        if(moment(newDate.fechacita).toDate() < moment(Date.now()).toDate()){
          setAccordedTimeError(true);
          showMessage('No se puede ingresar una fecha anterior a la actual', 'error');
          return;
        }
        if(moment(newDate.fechacita).toDate() < moment(newDate.fecha).toDate()){
          setTimeError(true);
          setAccordedTimeError(true);
          showMessage('La fecha de registro no puede ser anterior a la fecha acordada', 'error');
          return;
        }
      }
      if(selectedDate){
        const updatedDate = await updateDate(selectedDate.idcita, adjustedNewDate)
        setDates(prev => 
          prev.map((d) => d.idcita === updatedDate.idcita ? updatedDate : d)
        );
        showMessage('Se actualizó la cita correctamente', 'success');
      } else {
        const addedDate = await createDate(adjustedNewDate);
      
        setDates(prev => {
          const updated = [...prev, addedDate];
          return updated.sort((a, b) => new Date(a.fechacita).getTime() - new Date(b.fechacita).getTime());
        });
      
        showMessage('Se agregó la cita correctamente', 'success');
      }
      await handleFetchDates(searchTerm);
      handleClose();
    } catch (error) {
      if(error instanceof Error){
        showMessage(error.message, 'error');
      } else{
        showMessage('Ocurrió un error inesperado', 'error');
      }
    }
  };

  const toggleView = () => {
    state.setShowDisabled((prev) => !prev);
    setDates([]); 
    state.setSearchTerm(''); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      
    if (name === 'precio') {
      const numericValue = parseFloat(value) || 0;
      state.setNewDate(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      state.setNewDate(prev => ({
        ...prev, 
        [name]: value || ''  
      }));
    }
  };

  const handleDatesFilter = () => {
    return dates.filter(cita => {
      const fecha = moment(cita.fechacita);
  
      const coincideEstado = estadoFiltro !== null ? cita.idestado === estadoFiltro : true;
      const coincideFechaInicio = fechaInicio ? fecha.isSameOrAfter(fechaInicio, 'day') : true;
      const coincideFechaFin = fechaFin ? fecha.isSameOrBefore(fechaFin, 'day') : true;
      const coincidePaciente = pacienteId ? Number(cita.idpaciente) === pacienteId : true;
  
      return coincideEstado && coincideFechaInicio && coincideFechaFin && coincidePaciente;
    });
  };
  



  //PACIENTES
    const fetchPatients = useCallback(async () => {
      if (!debouncedSearchQuery.trim()) {
        setPatients([]);
        return;
      }
  
      try {
        setSearchLoading(true);
        setError(null);
  
        const queryParams = new URLSearchParams({
          page: '1',
          limit: '10',
          search: debouncedSearchQuery,
        });
  
        const response = await fetch(`/api/patients?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los pacientes');
        }
        
        const data: PatientResponse = await response.json();
        setPatients(data.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setPatients([]);
      } finally {
        setSearchLoading(false);
      }
    }, [debouncedSearchQuery]);
  
    useEffect(() => {
      fetchPatients();
    }, [fetchPatients]);
  
    const handlePatientSelect = (patient: Patient) => {
      setSelectedPatient(patient);
      setSearchQuery(`${patient.nombres} ${patient.apellidos} ${patient.idpaciente}`);
      setPatients([]);
      setPacienteId(patient?.idpaciente ?? null); 
    };

  
    const handleClearSearch = () => {
      setSearchQuery('');
      setSelectedPatient(null);
      setPacienteId(null);
    };
    useEffect(() => {
      if (!shouldSearch) return;
  
      const timer = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery);
      }, 500);
  
      return () => clearTimeout(timer);
    }, [searchQuery, shouldSearch]);
    



    const fetchPatientsDialog = useCallback(async () => {
      if (!debouncedSearchQueryDialog.trim()) {
        setPatientsDialog([]);
        return;
      }
  
      try {
        setSearchLoadingDialog(true);
        setErrorDialog(null);
  
        const queryParams = new URLSearchParams({
          page: '1',
          limit: '10',
          search: debouncedSearchQueryDialog,
        });
  
        const response = await fetch(`/api/patients?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los pacientes');
        }
        
        const data: PatientResponse = await response.json();
        setPatientsDialog(data.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setPatients([]);
      } finally {
        setSearchLoading(false);
      }
    }, [debouncedSearchQueryDialog]);
  
    useEffect(() => {
      fetchPatientsDialog();
    }, [fetchPatientsDialog]);

    const handlePatientSelectDialog = (patient: Patient) => {
      setSelectedPatientDialog(patient);
      setSearchQueryDialog(`${patient.nombres} ${patient.apellidos} ${patient.idpaciente}`);
      setPatientsDialog([]);
      setPacienteIdDialog(patient?.idpaciente ?? 22); 
    };

  
    const handleClearSearchDialog = () => {
      setSearchQueryDialog('');
      setSelectedPatientDialog(null);
      setPacienteIdDialog(null);
    };
    useEffect(() => {
      if (!shouldSearchDialog) return;
  
      const timer = setTimeout(() => {
        setDebouncedSearchQueryDialog(searchQueryDialog);
      }, 500);
  
      return () => clearTimeout(timer);
    }, [searchQueryDialog, shouldSearchDialog]);


  return {
    handleFetchDates,
    handleOpen,
    handleClose,
    handleChange,
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
    searchQuery,
    debouncedSearchQuery,
    patients,
    selectedPatient,
    loading,
    searchLoading,
    error,
    handlePatientSelect,
    handleClearSearch,  

    searchQueryDialog,
    debouncedSearchQueryDialog,
    patientsDialog,
    selectedPatientDialog,
    loadingDialog,
    searchLoadingDialog,
    errorDialog,
    setSearchQueryDialog,
    setDebouncedSearchQueryDialog,
    setPatientsDialog,
    setSelectedPatientDialog,
    setLoadingDialog,
    setSearchLoadingDialog,
    setErrorDialog,
    shouldSearchDialog,
    setShouldSearchDialog,
    handlePatientSelectDialog,
    handleClearSearchDialog
  };

}
