import { useCallback, useEffect, useState } from 'react';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments';
import { Patient } from '@/domain/entities/Patient';
import { PatientResponse } from '@/domain/dto/patient';
import usePaymentPlans from '../hooks/usePaymentPlan';
import { SelectChangeEvent } from '@mui/material/Select';

export default function useConsultationPaymentPlanHandlers(){
  const {
    paymentPlans,
    open,
    newPaymentPlan,
    cuotas,
    isLoading,
    selectedPaymentPlan,
    snackbar,
    paymentsLoading,
    payments,
    isEditingPayment,

    page,
    rowsPerPage,
    total,

    setPaymentPlans,
    setPaymentsLoading,
    setOpen,
    setNewPaymentPlan,
    setCuotas,
    setIsLoading,
    setSelectedPaymentPlan,
    setSnackbar,
    setPayments,
    setIsEditingPayment,

    setPage,
    setRowsPerPage,
    setTotal,

    //filtros
    filterStatus, 
    setFilterStatus,
    filterStartDate, 
    setFilterStartDate,
    filterEndDate, 
    setFilterEndDate,

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
    setLoading,
    setSearchLoading,
    setError,
    shouldSearch,
    setShouldSearch,

    fechaCreacionError,
    fechaLimiteError,
    montoError,
    descripcionError,
    pacienteError,
    cuotasError,
    setFechaCreacionError,
    setFechaLimiteError,
    setMontoError,
    setDescripcionError,
    setPacienteError,
    setCuotasError,

    resetForm,
    showMessage,

    //Consultas
    consultationID, 
    setConsultationID,
    isEditingConsultation, 
    setIsEditingConsultation,
  } = usePaymentPlans();
  const [montotal, setMontotal] = useState(0);
  // USE EFFECTS
  let pacienteIdAux = 2;


  // HANDLERS

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFetchPaymentPlans = async (p_consultationId: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/paymentsplan?consultationId=${p_consultationId}`);
      const json = await res.json();

      if (res.ok) {
        setPaymentPlans(json.data);
        console.log(json.data);
        setTotal(json.pagination.totalItems);
      } else {
        showMessage(json.error ?? 'Error al obtener planes', 'error');
      }
    } catch (error) {
      showMessage('Error inesperado al obtener planes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const submitValidations = () =>{
    if(!selectedPaymentPlan && new Date(newPaymentPlan.fechalimite).getDate() < new Date().getDate() - 1){
      showMessage('No puede registrar una fecha límite anterior a la fecha actual', 'error');
      return false;
    }
    return true;
  }

  const validations = () => {
    setFechaCreacionError(false);
    setFechaLimiteError(false);
    setMontoError(false);
    setDescripcionError(false);
    setPacienteError(false);
    setCuotasError(false);
    //Validacion de inputs
    if(!newPaymentPlan.fechacreacion || !newPaymentPlan.fechalimite || !newPaymentPlan.montotal || !newPaymentPlan.descripcion || parseInt(cuotas) < 1 || !selectedPatient){
      showMessage('Todos los datos son obligatorios', 'error');
      setFechaCreacionError(true);
      setFechaLimiteError(true);
      setMontoError(true);
      setDescripcionError(true);
      setPacienteError(true);
      setCuotasError(true);
      return false;
    }
    if(newPaymentPlan.descripcion.length > 150){
      setDescripcionError(true);
      showMessage('La descripcion debe tener menos de 150 caracteres', 'error');
      return false;
    }
    if(newPaymentPlan.montotal < 20 || newPaymentPlan.montotal === null){
      showMessage('Debe ingresar un monto mayor a 20', 'error');
      setMontoError(true);
      return false;
    }
    if(newPaymentPlan.idpaciente === null || newPaymentPlan.idpaciente === undefined){
      showMessage('Debe ingresar un paciente', 'error');
      setPacienteError(true);
      return false;
    }
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    if (
      newPaymentPlan.fechacreacion === null ||
      new Date(newPaymentPlan.fechacreacion) < oneYearAgo ||
      new Date(newPaymentPlan.fechacreacion) > tomorrow
    ) {
      showMessage('La fecha debe estar dentro del último año y no puede ser mayor a mañana.', 'error');
      setFechaCreacionError(true);
      return false;
    }
    if(new Date(newPaymentPlan.fechalimite) > new Date(new Date().setMonth(new Date().getMonth() + 18)) || newPaymentPlan.fechalimite === null){
      setFechaLimiteError(true);
      showMessage('No puede registrar una fecha límite superior a un año y medio a partir de ahora', 'error');
      return false;
    }
    if(new Date(newPaymentPlan.fechalimite) < new Date(newPaymentPlan.fechacreacion)){
      setFechaCreacionError(true);
      setFechaLimiteError(true);
      showMessage('La fecha limite no puede ser anterior a la fecha de creación', 'error');
      return false;
    }
    if(newPaymentPlan.montotal < 20 || newPaymentPlan.montotal === null){
      showMessage('Debe ingresar un monto mayor a 20', 'error');
      setMontoError(true);
      return false;
    }
    if(parseInt(cuotas) < 1 || cuotas === null){
      setCuotasError(true);
      showMessage('Debe ingresar las cuotas', 'error');
      return false;
    }
    if(payments.length < 1){
      showMessage('Error, no se generaron correctamente los pagos', 'error');
      return false;
    }
    return true;
  }

  const handleSubmitPaymentPlan = async () => {
    setFechaCreacionError(false);
    setFechaLimiteError(false);
    setMontoError(false);
    setDescripcionError(false);
    setPacienteError(false);
    setCuotasError(false);
    const updatedPlan = { ...newPaymentPlan, pagos: payments };
    newPaymentPlan.pagos = payments;
    if (selectedPatient) {
      updatedPlan.idpaciente = Number(selectedPatient);
    } else if (updatedPlan.idpaciente) {
      updatedPlan.idpaciente = Number(updatedPlan.idpaciente);
    }
    if(!consultationID || consultationID === 0){
      console.log('la id de la consulta es nula o 0: ' + consultationID);
    }
    else{
      updatedPlan.idconsulta = consultationID;
    }
    setNewPaymentPlan(newPaymentPlan)
    
    if(!validations()){
      return;
    }
    if(!submitValidations()){
      return;
    }
    if(selectedPaymentPlan){
      try {
        console.log(newPaymentPlan);
        console.log(selectedPatient);
        const res = await fetch(`/api/paymentsplan/${newPaymentPlan.idplanpago}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPaymentPlan)
        });
        
        const data = await res.json();
    
        if (!res.ok) {
          console.error('Error del servidor:', data.error);
          return;
        }
    
        console.log('Plan actualizado con éxito:', data.data);
        showMessage('Plan de pagos actualizado con éxito','success');
      } catch (err) {
        console.error('Error al enviar:', err);
      }
    }
    else{
      //create
      try {
        console.log(newPaymentPlan);
        
        const res = await fetch('/api/paymentsplan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          
          body: JSON.stringify(newPaymentPlan)
        });
    
        const data = await res.json();
    
        if (!res.ok) {
          console.error('Error del servidor:', data.error);
          return;
        }
    
        console.log('Plan creado con éxito:', data.data);
        showMessage('Plan de pagos creado con éxito','success');
      } catch (err) {
        console.error('Error al enviar:', err);
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      (name === 'cuotas' || name === 'montotal') &&
      !/^\d*$/.test(value) &&
      value !== ''
    ) {
      return;
    }
  
    if (name === 'cuotas') {
      if (value.length > 2 || parseInt(value) > 12) return;
      setCuotas(value);
    }
  
    if (name === 'montotal') {
      if (value.length > 6 || parseInt(value) > 100000) return;
      setMontotal(parseInt(value));
    }
  
    setNewPaymentPlan((prev) => ({
      ...prev,
      [name]: value === '' ? '' : name === 'montotal' ? parseFloat(value) || 0 : value,
    }));
  
    const cuotasNum = parseInt(name === 'cuotas' ? value : cuotas || '0');
    const montoNum = Number(name === 'montotal' ? Number(value) : montotal || '0');
  
    if (
      cuotasNum > 0 &&
      cuotasNum <= 12 &&
      montoNum > 20 &&
      montoNum <= 100000
    ) {
      setPayments(recalculatePayments2(montoNum, cuotasNum, payments));
    }
  };

const callRecalculatePayments = (montoNum: number) => {
  console.log('call recalculate');
  console.log(montoNum + ' ' + cuotas + ' ');
  setPayments(recalculatePayments2(montoNum, Number(cuotas), payments));
}

const recalculatePayments2 = (
  montotal: number,
  cuotas: number,
  pagosExistentes: Payment[]
): Payment[] => {
  if (cuotas <= 0 || montotal <= 0) return [];

  if(pagosExistentes.length === 0){
    const montoPorCuota = Math.floor(montotal/cuotas);
    const montoAdicional = montotal - (montoPorCuota * cuotas);
    const pagosNuevos: Payment[] = [];
    for(let i = 0; i < cuotas; i++){
      pagosNuevos.push({
        montoesperado: i === 0 ? montoPorCuota + montoAdicional : montoPorCuota,
        montopagado: 0,
        estado: 'pendiente',
        enlacecomprobante: null,
        fechapago: null,
        idplanpago: pagosExistentes[0]?.idplanpago ?? 0
      });
    }
    return pagosNuevos;
  }

  // Definicion de monto pagado y monto esperado restante
  let pagosEditadosSinMontoPagado = pagosExistentes.filter(
    (p) =>
      (p.estado === 'editado' ||
      p.estado === 'pagado') && 
      (p.montopagado ?? 0) === 0
  );
  let montoEsperadoEditado = pagosEditadosSinMontoPagado.reduce((total, p) => total + p.montoesperado, 0);

  let pagosConMontoPagado = pagosExistentes.filter(
    (p) =>
      (p.montopagado && p.montopagado > 0)
  );
  let montoPagado = pagosConMontoPagado.reduce((total, p) => total + Number(p.montopagado ?? 0), 0)
  
  
  //CUOTAS Y MONTO RESTANTE
  //si es <= 0 entonces hace falta agregar un pago
  let cuotasPendientes = cuotas - pagosEditadosSinMontoPagado.length - pagosConMontoPagado.length;

  let montoRestante = montotal - (montoPagado + montoEsperadoEditado);

  console.log('Monto Esperado : ' + montoEsperadoEditado);
  console.log('Monto Pagado Total: ' + montoPagado);
  console.log('Monto Restante Total: ' + montoRestante);

  if(cuotasPendientes <= 0){
    cuotasPendientes = 1;
  }

  let montoRestantePorCuotaRestante = Math.ceil(montoRestante / cuotasPendientes);

  console.log('monto restante por cuota:' + montoRestantePorCuotaRestante);

  //REASIGNAR LOS PLANES DE PAGO
  //retornar si es que se detecta que no es necesario recalcular
  if(montoPagado + montoEsperadoEditado >= montotal) return pagosExistentes;


  //crear un array de cuotas a agregar
  let pagosNuevos: Payment[] = []
  for(let i = 0; i < cuotasPendientes; i++){
    pagosNuevos.push({
      montoesperado: montoRestantePorCuotaRestante,
      enlacecomprobante: null,
      montopagado: 0,
      fechapago: null,
      estado: 'pendiente',
      idplanpago: pagosExistentes[0].idplanpago ?? 0
    });
  }

  const handleSetNewDate = (newDate: Date) => {
    const updatedDatePlan: PaymentPlan = {
      idplanpago: newPaymentPlan.idplanpago,
      idconsulta: newPaymentPlan.idconsulta,
      idpaciente: newPaymentPlan.idpaciente,
      descripcion: newPaymentPlan.descripcion,
      estado: newPaymentPlan.estado,
      fechacreacion: newDate,
      fechalimite: newPaymentPlan.fechalimite,
      montotal: newPaymentPlan.montotal,
      paciente: '',
    };
    setNewPaymentPlan(updatedDatePlan);
  }

  

  
   
  return [
    ...pagosEditadosSinMontoPagado,
    ...pagosConMontoPagado,
    ...pagosNuevos
  ];
  };

  const handleEditPayment = (index: number, changes: Partial<Payment>) => {
    if(changes.montoesperado! < 20){
      showMessage('El monto es demasiado pequeño', 'error');
      return;
    }
    console.log('Valores validos');
    setPayments((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        ...changes,
        estado: 'editado'
      };

      const montotalActual = parseFloat(newPaymentPlan.montotal as any) || montotal;
      const cuotasActual = cuotas;

      return recalculatePayments2(Number(montotalActual), Number(cuotasActual), updated);
    });
    setIsEditingPayment(1000);
    showMessage('Pago actualizado correctamente', 'success');
  };



  const handleEditPaymentInput = (index: number, monto: number) => {
    const montoPagado = payments.reduce((total, p) => total + (p.montopagado ?? 0), 0);

    const montoTotalPlan = newPaymentPlan?.montotal ?? 0;

    // Validaciones
    if (monto > montotal) {
      showMessage('El monto esperado sobrepasa al monto total del plan: ' + monto, 'error');
      return;
    }

    const nuevoMontoEsperadoTotal = montoPagado + monto;
    if (nuevoMontoEsperadoTotal > montotal) {
      showMessage(
        `El monto pagado mas el nuevo monto es (${nuevoMontoEsperadoTotal}) y supera el monto del plan (${montoTotalPlan})`,
        'error'
      );
      return;
    }

    if (monto < 0) {
      showMessage('No puede introducir valores menores a 0', 'error');
      return;
    }

    // Aplicar cambio
    setPayments((prev) =>
      prev.map((pago, i) =>
        i === index ? { ...pago, montoesperado: monto } : pago
      )
    );
  };

  const handleConsultationConfiguration = (p_consultationId: number, p_isEditingConsultation: boolean) => {
    setConsultationID(p_consultationId);
    setIsEditingConsultation(p_isEditingConsultation);
    if(p_isEditingConsultation){
      handleFetchPaymentPlans(p_consultationId);
    }
  }



  const handleOpen = () => {
    setOpen(true);
    setIsEditingPayment(1000);
    setMontotal(0);
    setCuotas('');
    setSelectedPatient(null);
    setSearchQuery('');
  }

  const handleClose = () => {
    setFechaCreacionError(false);
    setFechaLimiteError(false);
    setMontoError(false);
    setDescripcionError(false);
    setPacienteError(false);
    setCuotasError(false);

    setSelectedPaymentPlan(null);
    setIsEditingPayment(1000);
    setOpen(false);
    setPayments([]);
    resetForm();
    setMontotal(0);
    setCuotas('');
    setSelectedPatient(null);
    setSearchQuery('');
  }

  const handleSnackbarClose = () => {
    setSnackbar(null);
  }


  const handlePatientSelect = (patient: Patient) => {
    const updatedPlan = {
      ...newPaymentPlan,
      idpaciente: patient.idpaciente ?? null,
    };
    setNewPaymentPlan(updatedPlan);
    setSelectedPatient(patient.idpaciente ?? null);
    setSearchQuery(`${patient.nombres} ${patient.apellidos} ${patient.idpaciente}`);
    setPatients([]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedPatient(null);
  };
  useEffect(() => {
    if (!shouldSearch) return;

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, shouldSearch]);

  return{
    paymentPlans,
    isLoading,
    paymentsLoading,
    page,
    cuotas,
    rowsPerPage,
    total,
    open,
    newPaymentPlan,
    snackbar,
    selectedPaymentPlan,
    payments,
    isEditingPayment,
    recalculatePayments2,
    handleConsultationConfiguration,

    handleChangePage,
    handleChangeRowsPerPage,
    handleFetchPaymentPlans,
    handleOpen,
    handleClose,
    setNewPaymentPlan,
    setSnackbar,
    handleSubmitPaymentPlan,
    handleChange,
    handleSnackbarClose,
    handleEditPayment,
    handleEditPaymentInput,
    setIsEditingPayment,
    setPayments,

    //filtros
    filterStatus, 
    setFilterStatus,
    filterStartDate, 
    setFilterStartDate,
    filterEndDate, 
    setFilterEndDate,

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
    handlePatientSelect,
    handleClearSearch,
    shouldSearch,
    setShouldSearch,

    fechaCreacionError,
    fechaLimiteError,
    montoError,
    descripcionError,
    pacienteError,
    cuotasError,
    callRecalculatePayments,
  }
}