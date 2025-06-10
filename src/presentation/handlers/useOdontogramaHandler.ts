import { use, useEffect } from 'react';
import { Diagnosis } from '@/domain/entities/Diagnosis';
import useOdontogram from '../hooks/useOdontogram';
import { OdontogramDescription } from '@/domain/entities/OdontogramDescription';
import { Odontogram } from '@/domain/entities/Odontogram';
import useOdontogramData from '../hooks/useOdontogramData';
import { Cara } from '../config/odontogrmaConfig';

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

    selectedTooth,
    selectedFace,

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
        setOdontogram(json as Odontogram);
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


  const handleFaceClick = (
    numero: number,
    cara: string,
    idcara: number,
    iddiagnostico: number,
  ) => {
    console.log("iddiagnostico:", iddiagnostico);
    let diagnosisAux = diagnosis;
    if(!diagnosis){
      diagnosisAux = [
        {
          iddiagnostico: 1,
          descripcion: 'Sano',
          enlaceicono: '#ffff'
        },
        {
          iddiagnostico: 2,
          descripcion: 'Caries',
          enlaceicono: '#0000'
        }
      ]
    }
    else{
      diagnosisAux = diagnosis;
    }
    // Calculate the new diagnosis ID.  Cycle through the diagnoses.
    const nextDiagnostico = iddiagnostico === diagnosisAux.length ? 1 : iddiagnostico + 1;
    console.log('nextDiagnostico: ' + nextDiagnostico);
    // Find the corresponding diagnosis object
    console.log(diagnosisAux);
    const newDiagnosis = diagnosisAux.find((d) => d.iddiagnostico === nextDiagnostico);
    if (!newDiagnosis) {
      console.error(`Diagnosis with id ${nextDiagnostico} not found.`);
      return; // Or handle the error appropriately
    }
    // Create the new OdontogramDescription object
    const newDescription: OdontogramDescription = {
      idcara: idcara,
      cara: cara,
      idpieza: 0, // Assuming 'numero' is the idpieza
      codigofdi: numero, // You'll need to determine how to get this value
      nombrepieza: '', // You'll need to determine how to get this value
      iddiagnostico: nextDiagnostico,
      enlaceicono: newDiagnosis.enlaceicono,
      idodontograma: 1, // You'll need to determine how to get this value
    };
    // Update the state.  Handle the initial null case.
    setCreatedDestiptions((prevDescriptions) => {
      if (prevDescriptions === null) {
        return [newDescription]; // Start a new array if it's the first click
      }
      // Check if the description already exists (based on idcara, cara, and idpieza)
      const existingDescriptionIndex = prevDescriptions.findIndex(
        (desc) => desc.idcara === idcara && desc.cara === cara && desc.idpieza === numero
      );
      if (existingDescriptionIndex !== -1) {
        // If it exists, update the diagnosis
        const updatedDescriptions = [...prevDescriptions];
        updatedDescriptions[existingDescriptionIndex] = newDescription;
        return updatedDescriptions;
      } else {
        // If it doesn't exist, add it to the array
        return [...prevDescriptions, newDescription];
      }
    });
  };




  const handleFaceStateChange = (
    idpieza: number,
    idcara: number,
    iddiagnostico: number,
    codigofdi: number,
    nombrepieza: string,
    cara: string,
    idodontograma: number
  ) => {
    setCreatedDestiptions((prev) => {
      const updatedDiagnosis = diagnosis?.filter((d) => d.iddiagnostico === iddiagnostico)[0].enlaceicono ?? '#ffff';
      const updated = prev ? [...prev] : [];

      const index = updated.findIndex(
        (desc) =>
          desc.idpieza === idpieza &&
          desc.idcara === idcara &&
          desc.idodontograma === idodontograma
      );

      const newItem: OdontogramDescription = {
        idcara,
        idpieza,
        iddiagnostico,
        idodontograma,
        codigofdi,
        nombrepieza,
        cara,
        enlaceicono: updatedDiagnosis
      };

      if (index !== -1) {
        updated[index] = newItem; // editar
      } else {
        updated.push(newItem); // agregar nuevo
      }

      return updated;
    });
  };
  const handleSelectTooth = (numerofdi: number, nombre: string, cuadrante: number, caras: Cara[]) =>{
    setSelectedTooth({
      numero: numerofdi,
      nombre: nombre,
      cuadrante: cuadrante,
      caras: caras
    });
  }

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

    handleFetchOdontograms,

    buildToothFromDescriptions,
    getEstadoFromDiagnosis,

    handleFaceClick,
    handleFaceStateChange,
    handleSelectTooth,
  };
}