import { useEffect } from 'react';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import useOdontogram from '../hooks/useOdontogram';
import { OdontogramDescription } from '@/domain/entities/OdontogramDescription';
import { Odontogram } from '@/domain/entities/Odontogram';
import useOdontogramData from '../hooks/useOdontogramData';
import { Cara, piezaMap } from '../config/odontogrmaConfig';

export default function useOdontogramHandlers(){
  const{
    odontograms,
    odontogram,
    searchTerm,
    descriptions,
    createDescription,
    createOdontogram,
    createdDescriptions,
    diagnosis,
    selectedDiagnosis,
    observation,
    observationError,

    selectedTooth,
    selectedFace,

    patientId,
    consultationId,
    setPatientId,
    setConsultationId,

    isCreating,

    open,
    
    isLoading,
    snackbar,

    page,
    rowsperpage,
    total,
    setPage,
    setRowsPerPage,
    setTotal,

    //setters
    setOdontograms,
    setOdontogram,
    setCreateOdontogram,
    setCreateDestiption,
    setCreatedDestiptions,
    setDescriptions,
    setDiagnosis,
    setSelectedDiagnosis,
    setObservation,
    setObservationError,

    setSelectedTooth,
    setSelectedFace,

    setIsCreating,
    
    setOpen,
    setSearchTerm,
    setIsLoanding,
    setSnackbar,
    showMessage,
    resetForm,
  } = useOdontogram();

  const {
    currentOdontogram,
    descriptions: currentDescriptions,
    dentalStates,
    setCurrentOdontogram,
    setDescriptions: setCurrentDescriptions,
    setDiagnosis: setCurrentDiagnosis,
    setDentalStates,
    buildDentalStatesFromDescriptions,
    buildToothFromDescriptions,
    getEstadoFromDiagnosis
  } = useOdontogramData();


  useEffect(() => {
    handleFetchOdontograms();
  }, [page, rowsperpage]);

  useEffect(() => {
    handleFetchDiagnosis();
  }, []);

  /*useEffect(() => {
    if (currentDescriptions.length > 0 && currentDiagnosis.length > 0) {
      const states = buildDentalStatesFromDescriptions(currentDescriptions);
      setDentalStates(states);
    }
  }, [currentDescriptions, currentDiagnosis]);*/


  const handleFetchOdontograms = async () => {
    try{
      setIsLoanding(true);

      const res = await fetch(`/api/odontogram/patient?idpaciente=1&page=${page + 1}&limit=10&searchQuery=${searchTerm}`);
      const json = await res.json();

      if(res.ok){
        setOdontograms(json.data)
      }
      else{
        showMessage('Error al obtener los registros del paciente', 'error');
        console.log(json.error);
      }
    }
    catch (error){
      showMessage('Ocurrio un error', 'error');
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'observation') {
      const isValid = validateObservation(value);

      if (!isValid) {
        showMessage('No se pueden introducir más de 150 caracteres ni caracteres prohibidos (< o >)', 'error');
        setObservationError(true);
        return;
      }

      setObservation(value);
      setObservationError(false);
    }
  };

  const validateObservation = (value: string): boolean => {
    return !(value.includes('<') || value.includes('>') || value.length > 150);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFetchLastOdontogram = async(p_idPaciente: number) => {
    try{
      if(isCreating) return;
      setIsLoanding(true);
      const res = await fetch(`/api/odontogram/patient/${p_idPaciente}`);
      const json = await res.json();
      if(res.ok){
        setOdontogram(json as Odontogram);
        setObservation(json.observaciones);
      }
      else{
        showMessage('Error al obtener el registro paciente', 'error');
        console.log(json.error);
      }
    }
    catch (error){
      showMessage('Ocurrio un error', 'error');
      console.log(error);
    }
  };
  const handleFetchDiagnosis = async(): Promise<Diagnosis[] | null> =>{
    try{
      const res = await fetch(`/api/diagnosis`);
      const json = await res.json();
      if(res.ok){
        setDiagnosis(json);
        return json;
      }
      else{
        showMessage('Error al obtener el registro del paciente', 'error');
        console.log(json.error);
        return null;
      }
    }
    catch (error){
      showMessage('Ocurrio un error', 'error');
      console.log(error);
      return null;
    }
  };

  const handleFetchLasOdontogramPerConsultationId = async (p_idConsulta: number) =>{
    try{
      setIsLoanding(true);
      const res = await fetch(`/api/odontogram/consultation/${p_idConsulta}`);
      const json = await res.json();
      if(res.ok){
        setOdontogram(json as Odontogram);
        setObservation(json.observaciones);
      }
      else{
        showMessage('Error al obtener el registro de la consulta', 'error');
        console.log(json.error);
      }
    }
    catch (error){
      showMessage('Ocurrio un error', 'error');
      console.log(error);
    }
  }


  const handleFaceClick = (
    numero: number,
    cara: string,
    idcara: number,
    _iddiagnostico: number,
    _idPieza: number
  ) => {
    if(!isCreating) return;
    const pieza = piezaMap[numero];
    if (!pieza) return;

    const { idpieza, descripcion: nombrepieza } = pieza;

    const diagnosisAux = diagnosis ?? [
      { iddiagnostico: 1, descripcion: 'Sano', enlaceicono: '#ffff' },
      { iddiagnostico: 2, descripcion: 'Caries', enlaceicono: '#0000' },
      { iddiagnostico: 3, descripcion: 'Fractura', enlaceicono: '#ff00ff' }
    ];

    const currentIdDiagnostico = createdDescriptions?.find(
      (desc) => desc.idpieza === idpieza && desc.idcara === idcara
    )?.iddiagnostico ?? 0;

    const nextDiagnostico = currentIdDiagnostico === diagnosisAux.length ? 1 : currentIdDiagnostico + 1;
    const newDiagnosis = diagnosisAux.find(d => d.iddiagnostico === nextDiagnostico);
    const diagnostico = newDiagnosis?.descripcion;
    if (!newDiagnosis) return;

    const newDescription: OdontogramDescription = {
      idcara,
      cara,
      idpieza,
      codigofdi: numero,
      nombrepieza,
      diagnostico: diagnostico ?? '',
      iddiagnostico: nextDiagnostico,
      enlaceicono: newDiagnosis.enlaceicono,
      idodontograma: 1,
    };

    upsertOdontogramDescription(newDescription);
  };



  const handleFaceStateChange = (
    idcara: number,
    iddiagnostico: number,
    codigofdi: number,
    nombrepieza: string,
    cara: string,
    idodontograma: number
  ) => {
    if(!isCreating) return;
    const idpieza = piezaMap[codigofdi].idpieza;
    const enlaceicono = diagnosis?.find((d) => d.iddiagnostico === iddiagnostico)?.enlaceicono ?? '#ffff';
    const diagnostico = diagnosis?.find((d) => d.iddiagnostico === iddiagnostico)?.descripcion ?? 'Sano';

    const newItem: OdontogramDescription = {
      idcara,
      idpieza,
      iddiagnostico,
      idodontograma,
      codigofdi,
      nombrepieza,
      cara,
      enlaceicono,
      diagnostico
    };

    upsertOdontogramDescription(newItem);
  };
  const handleSelectTooth = (numerofdi: number, nombre: string, cuadrante: number, caras: Cara[]) =>{
    setSelectedTooth({
      numero: numerofdi,
      nombre: nombre,
      cuadrante: cuadrante,
      caras: caras
    });
  }

  const upsertOdontogramDescription = (newDesc: OdontogramDescription) => {
    setCreatedDestiptions((prev) => {
      const updated = prev ? [...prev] : [];

      const index = updated.findIndex(
        (desc) =>
          desc.idpieza === newDesc.idpieza &&
          desc.idcara === newDesc.idcara
      );

      if (index !== -1) {
        updated[index] = newDesc;
      } else {
        updated.push(newDesc);
      }

      return updated;
    });
  };

  const handlePostOdontogram = async () => {
    if(!isCreating) return false;
    if(!createdDescriptions || createdDescriptions?.length === 0){
      showMessage('No se puede registrar un odontograma vacio', 'error');
      return;
    }
    const filteredDescriptions = (createdDescriptions ?? []).filter(
      (desc) => desc.iddiagnostico !== 1
    );

    const odontogram: Odontogram = {
      idodontograma: 1,
      idpaciente: patientId,
      idconsulta: consultationId,
      paciente: '',
      fechacreacion: new Date(),
      observaciones: observation,
      descripciones: filteredDescriptions,
    };

    try {
      console.log('Datos a insertar: ');
      console.log(odontogram);
      const response = await fetch('/api/odontogram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(odontogram),
      });

      if (!response.ok) {
        throw new Error(`Error en el POST: ${response.statusText}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error('Error al guardar el odontograma:', error);
    }
  };

  const handleOdontogramConfiguration = (creating: boolean, p_idPaciente: number, p_idConsulta: number | null) => {
    setIsCreating(creating);
    setPatientId(p_idPaciente);
    setConsultationId(p_idConsulta);

    if(p_idConsulta && !creating){
      handleFetchLasOdontogramPerConsultationId(p_idConsulta);
      return;
    }
    handleFetchLastOdontogram(p_idPaciente);
  };

  const handleSnackbarClose = () => {
    setSnackbar(null);
  };
  return{
    odontograms,
    odontogram,
    searchTerm,
    descriptions,
    createDescription,
    createOdontogram,
    createdDescriptions,
    diagnosis,
    selectedDiagnosis,

    isCreating,

    open,
    
    isLoading,
    snackbar,
    handleSnackbarClose,

    page,
    rowsperpage,
    total,

    currentOdontogram,
    currentDescriptions,
    //currentDiagnosis,
    dentalStates,
    selectedTooth,


    setPage,
    setRowsPerPage,
    setTotal,

    //setters
    setOdontograms,
    setOdontogram,
    setCreateOdontogram,
    setCreateDestiption,
    setCreatedDestiptions,
    setDescriptions,
    setDiagnosis,
    setSelectedDiagnosis,
    
    setOpen,
    setSearchTerm,
    setIsLoanding,
    setSnackbar,
    showMessage,
    resetForm,

    handleFetchDiagnosis,
    handleChangePage,
    handleChangeRowsPerPage,
    handleFetchLastOdontogram,
    handleChange,
    observation,
    observationError,

    handleFetchOdontograms,

    buildToothFromDescriptions,
    getEstadoFromDiagnosis,

    handleFaceClick,
    handleFaceStateChange,
    handleSelectTooth,
    handlePostOdontogram,
    handleOdontogramConfiguration,
    
  };
}