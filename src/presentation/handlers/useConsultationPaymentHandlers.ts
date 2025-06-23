import { Payment } from '@/domain/entities/Payments';
import usePaymentPlans from '../hooks/usePayments';
import useConsultationPaymentPlanHandlers from '@/presentation/handlers/useConsultationPaymentPlanHandler'

export default function useConsultationPaymentHandler(){
  const {
    paymentIndex,
    status,
    comprobanteDialogOpen,
    selectedPayment,
    selectedIndex,
    fechapago,
    montopago,

    setPaymentIndex,
    setStatus,
    setComprobanteDialogOpen,
    setSelectedPayment,
    setSelectedIndex,
    setMontoPago,
    setFechaPago,

    snackbar,
    showMessage
  } = usePaymentPlans();

  const{
    payments,
    handleEditPayment,
  } = useConsultationPaymentPlanHandlers();

  const handleStatusChange = (event: { target: { value: string } }) => {
      setStatus(event.target.value);
    };
    
    const handleOpenComprobanteDialog = (payment: Payment, index: number) => {
      setSelectedPayment(payment);
      setSelectedIndex(index);
      setComprobanteDialogOpen(true);
    };
    
  
    const handleUploadComprobante = async (idpago: number, enlaceComprobante: string | null) => {
      try {
        const paymentIndex = payments.findIndex(p => p.idpago === idpago);
        if (paymentIndex === -1) return;
        
        const updatedPayments = [...payments];
        updatedPayments[paymentIndex] = {
          ...updatedPayments[paymentIndex],
          enlacecomprobante: enlaceComprobante,
          estado: updatedPayments[paymentIndex].estado
        };
        
        handleEditPayment(paymentIndex, { 
          enlacecomprobante: enlaceComprobante,
          //estado: enlaceComprobante ? 'completado' : 'pendiente'
        });
  
        setComprobanteDialogOpen(false);
        setSelectedPayment(null);
      } catch (error) {
        console.error('Error al actualizar comprobante:', error);
      }
    };
  
    const handleCloseComprobanteDialog = () => {
      setComprobanteDialogOpen(false);
      setSelectedPayment(null);
    };

  return{
    handleUploadComprobante,
    handleCloseComprobanteDialog,
    handleOpenComprobanteDialog,
    handleStatusChange,
    status,
    montopago,
    fechapago,

    paymentIndex,
    comprobanteDialogOpen,
    selectedPayment,
    selectedIndex,
    setMontoPago,
    setFechaPago
  }
}