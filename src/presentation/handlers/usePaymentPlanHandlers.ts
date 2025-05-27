import { useCallback, useEffect, useState } from 'react';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments';
import { Patient } from '@/domain/entities/Patient';
import { PatientResponse } from '@/domain/dto/patient';
import usePaymentPlans from '../hooks/usePaymentPlan';
import { SelectChangeEvent } from '@mui/material/Select';

export default function usePaymentPlanHandlers(){
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

    resetForm,
    showMessage
  } = usePaymentPlans();
  const [montotal, setMontotal] = useState('');
  // USE EFFECTS

  useEffect(() => {
    console.log(page, rowsPerPage);
    handleFetchPaymentPlans();
  }, [page, rowsPerPage]);

  // HANDLERS

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFetchPaymentPlans = async () => {
    try {
      setIsLoading(true);
      let filters = '';
      if(filterStatus !== ''){
        filters += '&estado='+filterStatus;
      }
      if(filterStartDate !== ''){
        filters += '&fechainicio='+filterStartDate;
      }
      if(filterEndDate !== ''){
        filters += '&fechafin='+filterEndDate;
      }
      const res = await fetch(`/api/paymentsplan?page=${page+1}&limit=${10}${filters}`);
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
    
    //Validacion de inputs
    if(!newPaymentPlan.fechacreacion || !newPaymentPlan.fechalimite || !newPaymentPlan.montotal || !newPaymentPlan.descripcion || parseInt(cuotas) < 1 || !selectedPatient){
      showMessage('Todos los datos son obligatorios', 'error');
      return false;
    }
    if(newPaymentPlan.montotal < 20 || newPaymentPlan.montotal === null){
      showMessage('Debe ingresar un monto mayor a 20', 'error');
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
      return false;
    }
    if(new Date(newPaymentPlan.fechalimite) > new Date(new Date().setMonth(new Date().getMonth() + 18)) || newPaymentPlan.fechalimite === null){
      showMessage('No puede registrar una fecha límite superior a un año y medio a partir de ahora', 'error');
      return false;
    }
    if(new Date(newPaymentPlan.fechalimite) < new Date(newPaymentPlan.fechacreacion)){
      showMessage('La fecha limite no puede ser anterior a la fecha de creación', 'error');
      return false;
    }
    if(newPaymentPlan.montotal < 20 || newPaymentPlan.montotal === null){
      showMessage('Debe ingresar un monto mayor a 20', 'error');
      return false;
    }
    if(parseInt(cuotas) < 1 || cuotas === null){
      showMessage('Debe ingresar las cuotas', 'error');
      return false;
    }
    if(payments.length < 1){
      showMessage('Error, no se generaron correctamente los pagos', 'error');
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    newPaymentPlan.pagos = payments;
    if(selectedPatient){
      newPaymentPlan.idpaciente =  Number(selectedPatient?.idpaciente) ?? null;
      console.log('a'+ Number(selectedPatient?.idpaciente ?? 2));
    }
    else if(newPaymentPlan.idpaciente){
      newPaymentPlan.idpaciente = Number(newPaymentPlan?.idpaciente) ?? null;
      console.log('b'+ Number(newPaymentPlan?.idpaciente ?? 2));
    }
    setNewPaymentPlan(newPaymentPlan)
    
    if(!validations()){
      return;
    }
    if(!submitValidations()){
      return;
    }
    //Si es que existe un plan de pagos seleccionado
    if(selectedPaymentPlan){
      //update
      try {
        
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
        handleFetchPaymentPlans();
        handleClose();
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
        handleFetchPaymentPlans();
        handleClose();
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
      setMontotal(value);
    }
  
    setNewPaymentPlan((prev) => ({
      ...prev,
      [name]: value === '' ? '' : name === 'montotal' ? parseFloat(value) || 0 : value,
    }));
  
    const cuotasNum = parseInt(name === 'cuotas' ? value : cuotas || '0');
    const montoNum = parseFloat(name === 'montotal' ? value : montotal || '0');
  
    if (
      cuotasNum > 0 &&
      cuotasNum <= 12 &&
      montoNum > 20 &&
      montoNum <= 100000
    ) {
      setPayments(recalculatePayments2(montoNum, cuotasNum, payments));
    }
  };

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

      const montotalActual = parseFloat(newPaymentPlan.montotal as any) || parseInt(montotal);
      const cuotasActual = parseInt(cuotas);

      return recalculatePayments2(montotalActual, cuotasActual, updated);
    });
    setIsEditingPayment(1000);
    showMessage('Pago actualizado correctamente', 'success');
  };


  const handleEdit = async (idPaymentPlan: number) => {
    try {
      setShouldSearch(false);
      setPaymentsLoading(true);

      const res = await fetch(`/api/paymentsplan/${idPaymentPlan}`);
      const json = await res.json();

      if (res.ok) {
        const rawPlan = json.data;

        // Transformar los campos
        const paymentPlan: PaymentPlan = {
          idplanpago: rawPlan.idplanpago,
          fechacreacion: new Date(rawPlan.fechacreacion),
          fechalimite: new Date(rawPlan.fechalimite),
          montotal: parseFloat(rawPlan.montotal),
          descripcion: rawPlan.descripcion,
          estado: rawPlan.estado,
          idconsulta: rawPlan.idconsulta,
          idpaciente: rawPlan.idpaciente,
          paciente: rawPlan.paciente,
          pagos: rawPlan.pagos?.map((pago: Payment) => ({
            idpago: pago.idpago,
            fechapago: new Date(pago.fechapago ?? new Date()),
            montoesperado: (pago.montoesperado),
            montopagado: (pago.montopagado),
            enlacecomprobante:pago.enlacecomprobante,
            estado: pago.estado,
          })),
        };
        setNewPaymentPlan(paymentPlan);
        setSelectedPaymentPlan(paymentPlan);
        setCuotas(rawPlan.pagos?.length ?? 0);
        setMontotal(rawPlan.montotal ?? '');
        setPayments(rawPlan.pagos ?? []);
        console.log("paciente:" + rawPlan.idpaciente)
        if(rawPlan.paciente && rawPlan.idpaciente) {
          setSelectedPatient(rawPlan.idpaciente);
          setSearchQuery(rawPlan.paciente);
        }
        console.log('paciente '+ rawPlan.paciente);
        setOpen(true);
      } else {
        showMessage('Error al obtener planes', 'error');
      }
    } catch {
      showMessage('Error al obtener planes', 'error');
    } finally {
      setPaymentsLoading(false);
    }
  };


  const handleEditPaymentInput = (index: number, monto: number) => {
    const montoPagado = payments.reduce((total, p) => total + (p.montopagado ?? 0), 0);

    const montoTotalPlan = newPaymentPlan?.montotal ?? 0;

    // Validaciones
    if (monto > parseInt(montotal)) {
      showMessage('El monto esperado sobrepasa al monto total del plan: ' + monto, 'error');
      return;
    }

    const nuevoMontoEsperadoTotal = montoPagado + monto;
    if (nuevoMontoEsperadoTotal > parseInt(montotal)) {
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



  const handleOpen = () => {
    setOpen(true);
    setIsEditingPayment(1000);
    setMontotal('');
    setCuotas('');
    setSelectedPatient(null);
    setSearchQuery('');
  }

  const handleClose = () => {
    setSelectedPaymentPlan(null);
    setIsEditingPayment(1000);
    setOpen(false);
    setPayments([]);
    resetForm();
    setMontotal('');
    setCuotas('');
    setSelectedPatient(null);
    setSearchQuery('');
  }

  const handleSnackbarClose = () => {
    setSnackbar(null);
  }

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
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

    handleChangePage,
    handleChangeRowsPerPage,
    handleFetchPaymentPlans,
    handleOpen,
    handleClose,
    setNewPaymentPlan,
    setSnackbar,
    handleSubmit,
    handleChange,
    handleSnackbarClose,
    handleEdit,
    handleEditPayment,
    handleEditPaymentInput,
    setIsEditingPayment,
    setPayments,
    handleStatusFilterChange,

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
  }
}
