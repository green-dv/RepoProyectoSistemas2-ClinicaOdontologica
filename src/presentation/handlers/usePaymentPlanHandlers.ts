import { useEffect, useState } from 'react';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments';
import usePaymentPlans from '../hooks/usePaymentPlan';

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
    
    resetForm,
    showMessage
  } = usePaymentPlans();
  const [montotal, setMontotal] = useState(0); 
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
      const res = await fetch(`/api/paymentsplan?page=${page+1}&limit=${rowsPerPage}`);
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

  const handleSubmit = () => {
    
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
  
    setNewPaymentPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    let nextCuotas = cuotas;
    let nextMontotal = montotal;
  
    if (name === 'cuotas') {
      nextCuotas = parseInt(value) || 0;
      setCuotas(nextCuotas);
    }
  
    if (name === 'montotal') {
      nextMontotal = numericValue;
      setMontotal(nextMontotal);
    }
  
    if ((name === 'montotal' || name === 'cuotas') && nextCuotas > 0 && nextMontotal > 0 && nextCuotas < 13 && nextMontotal < 100000) {
      setPayments(recalculatePayments(nextMontotal, nextCuotas, payments));
    }
  };

  const recalculatePayments = (
    montotal: number,
    cuotas: number,
    pagosExistentes: Payment[] = []
  ): Payment[] => {
    if (cuotas <= 0 || montotal <= 0) return [];
  
    const pagosFijos = pagosExistentes.filter(
      (p) => p.estado === 'completado' || p.estado === 'editado'
    );
  
    const sumaPagosFijos = pagosFijos.reduce((acc, p) => {
      if (p.estado === 'completado') return acc + p.montopagado;
      if (p.estado === 'editado') return acc + p.montoesperado;
      return acc;
    }, 0);
  
    const cuotasRestantes = cuotas - pagosFijos.length;
    const montoRestante = montotal - sumaPagosFijos;
  
    if (cuotasRestantes <= 0) return pagosFijos;
  
    const montoBase = Math.floor(montoRestante / cuotasRestantes);
    const diferencia = montoRestante - montoBase * cuotasRestantes;
  
    const nuevosPagos: Payment[] = [];
    for (let i = 0; i < cuotasRestantes; i++) {
      if(montoBase + diferencia <= 0) {
        continue;
      }
      nuevosPagos.push({
        montoesperado: i === 0 ? montoBase + diferencia : montoBase,
        montopagado: 0,
        fechapago: null,
        estado: 'pendiente',
        enlacecomprobante: null,
        idplanpago: newPaymentPlan.idplanpago,
      });
    }
  
    return [...pagosFijos, ...nuevosPagos];
  };

  const handleEditPayment = (index: number, changes: Partial<Payment>) => {
    if(changes.montoesperado && newPaymentPlan.pagos && (changes.montoesperado > newPaymentPlan.montotal)){
      showMessage('El monto esperado sobrepasa al monto total del plan', 'error');
      return;
    }
    if(changes.montoesperado && newPaymentPlan.pagos && (changes.montoesperado + newPaymentPlan.pagos.reduce((total, p) => total + p.montopagado, 0) > newPaymentPlan.montotal)){
      showMessage('La suma del monto ingresado más los montos pagados es de ' + changes.montoesperado + newPaymentPlan.pagos.reduce((total, p) => total + p.montopagado, 0) + 'y sobrepasa al monto total de plan', 'error');
      return;
    }
    if(changes.montoesperado && newPaymentPlan.pagos && (changes.montoesperado + newPaymentPlan.pagos.reduce((total, p) => total + p.montoesperado, 0) > newPaymentPlan.montotal)){
      showMessage('La suma del monto ingresado más los montos esperados es de ' + changes.montoesperado + newPaymentPlan.pagos.reduce((total, p) => total + p.montopagado, 0) + 'y sobrepasa al monto total de plan', 'error');
      return;
    }
    if(changes.montoesperado! < 20){
      showMessage('El monto es demasiado pequeño', 'error');
      return;
    }
    if(changes.montoesperado)
    setPayments((prev) => {
      const updated = [...prev];
  
      updated[index] = {
        ...updated[index],
        ...changes,
        estado: 'editado' 
      };
  
      const montotalActual = parseFloat(newPaymentPlan.montotal as any) || montotal;
      const cuotasActual = cuotas;
  
      return recalculatePayments(montotalActual, cuotasActual, updated);
    });
    setIsEditingPayment(1000);
    showMessage('Pago actualizado correctamente', 'success');
  };
  

  const handleEdit = async (idPaymentPlan: number) => {
    try {
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
        setMontotal(rawPlan.montotal ?? 0);
        setPayments(rawPlan.pagos ?? []);
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
    if(monto && newPaymentPlan.pagos && (monto > newPaymentPlan.montotal)){
      showMessage('El monto esperado sobrepasa al monto total del plan', 'error');
      return;
    }
    if(monto && newPaymentPlan.pagos && (monto + newPaymentPlan.pagos.reduce((total, p) => total + p.montopagado, 0) > newPaymentPlan.montotal)){
      return;
    }
    if(monto && newPaymentPlan.pagos && (monto + newPaymentPlan.pagos.reduce((total, p) => total + p.montoesperado, 0) > newPaymentPlan.montotal)){
      return;
    }
    if(monto < 0){
      return;
    }
    setPayments((prev) =>
      prev.map((pago, i) =>
        i === index ? { ...pago, montoesperado: monto } : pago
      )
    );
  };
  

  const handleOpen = () => {
    setOpen(true);
    setIsEditingPayment(1000);
    setMontotal(0);
    setCuotas(0);
    setSelectedPaymentPlan(null);
  }

  const handleClose = () => {
    setSelectedPaymentPlan(null);
    setIsEditingPayment(1000);
    setOpen(false);
    setPayments([]);
    resetForm();
  }
  
  const handleSnackbarClose = () => {
    setSnackbar(null);
  } 

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
  }
}
