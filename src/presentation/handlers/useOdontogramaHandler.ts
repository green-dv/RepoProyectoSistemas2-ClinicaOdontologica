import { use, useEffect } from 'react';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import useOdontogram from '../hooks/useOdontogram';
import { OdontogramDescription, OdontogramDescriptionDTO } from '@/domain/entities/OdontogramDescription';
import { Odontogram, CreateOdontogram } from '@/domain/entities/Odontogram';
import useOdontogramData from '../hooks/useOdontogramData';
import { DentalState, Diente, CaraDiagnostico, EstadoCara } from '../config/odontogrmaConfig';

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
    diagnosis: currentDiagnosis,
    dentalStates,
    selectedTooth,
    setCurrentOdontogram,
    setDescriptions: setCurrentDescriptions,
    setDiagnosis: setCurrentDiagnosis,
    setDentalStates,
    setSelectedTooth,
    buildDentalStatesFromDescriptions,
    buildToothFromDescriptions,
    getEstadoFromDiagnosis
  } = useOdontogramData();


  useEffect(() => {
    console.log(page, rowsperpage);
    handleFetchOdontograms();
  }, [page, rowsperpage]);

  useEffect(() => {
    handleFetchDiagnosis();
  }, []);

  //para actualizar estados dentales
  useEffect(() => {
    if (currentDescriptions.length > 0 && currentDiagnosis.length > 0) {
      const states = buildDentalStatesFromDescriptions(currentDescriptions);
      setDentalStates(states);
    }
  }, [currentDescriptions, currentDiagnosis]);

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
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFetchLastOdontogram = async() => {
    try{
      setIsLoanding(true);

      const res = await fetch(`/api/odontogram/patient/1`);
      const json = await res.json();

      if(res.ok){
        setOdontogram(json.data)
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
      console.log('handlers res: ' + res);
      if(res.ok){
        setDiagnosis(json);
        console.log('diagnosticos handlers: ' + json);
        return json;
      }
      else{
        showMessage('Error al obtener el registro paciente', 'error');
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
  const handleToothClick = (codigofdi: number) => {
    if (currentDescriptions.length > 0) {
      const tooth = buildToothFromDescriptions(codigofdi, currentDescriptions);
      setSelectedTooth(tooth);
    } else {
      // Si no hay descripciones, crear un diente básico
      const basicTooth: Diente = {
        id: codigofdi,
        codigofdi,
        nombre: `Pieza ${codigofdi}`,
        caras: []
      };
      setSelectedTooth(basicTooth);
    }
  };
   const handleFaceStateChange = async (codigofdi: number, cara: string, iddiagnostico: number) => {
    if (!currentOdontogram) {
      showMessage('No hay odontograma seleccionado', 'error');
      return;
    }

    try {
      // Buscar el ID de la pieza basado en el código FDI
      const piezaId = await getPiezaIdByCodigoFDI(codigofdi);
      if (!piezaId) {
        showMessage('No se encontró la pieza dental', 'error');
        return;
      }

      // Buscar el ID de la cara
      const caraId = await getCaraIdByNombre(cara);
      if (!caraId) {
        showMessage('No se encontró la cara dental', 'error');
        return;
      }

      const newDescription: OdontogramDescriptionDTO = {
        idcara: caraId,
        idpieza: piezaId,
        iddiagnostico,
        idodontograma: currentOdontogram.idodontograma
      };

      // Verificar si ya existe esta descripción
      const existingDescription = currentDescriptions.find(
        desc => desc.codigofdi === codigofdi && 
                desc.cara.toLowerCase() === cara.toLowerCase()
      );

      if (existingDescription) {
        // Si existe, eliminar la anterior y agregar la nueva
        await handleRemoveDescription(existingDescription);
      }

      // Agregar nueva descripción
      const res = await fetch('/api/odontogram/description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDescription),
      });

      if (res.ok) {
        // Refrescar descripciones
        await handleFetchLastOdontogram();
        showMessage('Diagnóstico actualizado correctamente', 'success');
      } else {
        showMessage('Error al actualizar el diagnóstico', 'error');
      }
    } catch (error) {
      showMessage('Error al procesar el cambio', 'error');
      console.log(error);
    }
  };
    const handleRemoveDescription = async (description: OdontogramDescription) => {
    try {
      const res = await fetch('/api/odontogram/description', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idodontograma: description.idodontograma,
          idcara: description.idcara,
          idpieza: description.idpieza,
          iddiagnostico: description.iddiagnostico
        }),
      });

      if (!res.ok) {
        showMessage('Error al eliminar descripción anterior', 'warning');
      }
    } catch (error) {
      console.log('Error eliminando descripción:', error);
    }
  };

  // Funciones auxiliares para obtener IDs
  const getPiezaIdByCodigoFDI = async (codigofdi: number): Promise<number | null> => {
    try {
      const res = await fetch(`/api/piezas/codigo/${codigofdi}`);
      const json = await res.json();
      return res.ok ? json.id : null;
    } catch {
      return null;
    }
  };

  const getCaraIdByNombre = async (nombre: string): Promise<number | null> => {
    try {
      const res = await fetch(`/api/caras/nombre/${nombre}`);
      const json = await res.json();
      return res.ok ? json.id : null;
    } catch {
      return null;
    }
  };

  // const handlePostOdontogram = async(odontogram: CreateOdontogram, newDiagnosis: OdontogramDescriptionDTO) =>{
    
  // }
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

    open,
    
    isLoading,
    snackbar,

    page,
    rowsperpage,
    total,

    currentOdontogram,
    currentDescriptions,
    currentDiagnosis,
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

    handleToothClick,
    handleFaceStateChange,
    handleFetchOdontograms,

    buildToothFromDescriptions,
    getEstadoFromDiagnosis

  };
}