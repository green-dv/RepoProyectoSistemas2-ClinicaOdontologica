'use client';
import PaymentPlansTable from "./PaymentPlansTable";
import usePaymentPlanHandlers from "@/presentation/handlers/usePaymentPlanHandlers";
import usePaymentHandlers from "@/presentation/handlers/usePaymentHandler";
import { Add } from "@mui/icons-material";
import 
{
  Paper,
  Box,
  Button
} from "@mui/material";
import SnackbarAlert from "../SnackbarAlert";
import PaymentsPlanDialog from "./PaymentsPlanDialog";

export default function PaymentPlansComponent(){
  const {
    paymentPlans,
    isLoading,
    paymentsLoading,
    page,
    total,
    cuotas,
    rowsPerPage,
    open,
    newPaymentPlan,
    snackbar,
    payments,
    isEditingPayment,

    handleChangePage,
    handleChangeRowsPerPage,
    handleOpen,
    handleClose,
    handleSubmit,
    selectedPaymentPlan,
    handleChange,
    handleSnackbarClose,
    handleEdit,
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
    handleStatusFilterChange,
    handleFetchPaymentPlans,

    //PACIENTES
    searchLoading,
    searchQuery,
    patients,
    handleClearSearch,
    handlePatientSelect,
    setSearchQuery,
    setShouldSearch,
    shouldSearch,
    fechaCreacionError,
    fechaLimiteError,
    montoError,
    descripcionError,
    pacienteError,
    cuotasError,
  } = usePaymentPlanHandlers();

  const{
    handleUploadComprobante,
    handleCloseComprobanteDialog,
    handleOpenComprobanteDialog,
    handleStatusChange,
    status,
    fechapago,
    montopago,

    paymentIndex,
    comprobanteDialogOpen,
    selectedPayment,
    selectedIndex,
    setFechaPago,
    setMontoPago,
  } = usePaymentHandlers();

  
  return(
    <Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Añadir Plan de pagos
        </Button>
      </Box>
      <PaymentPlansTable
        paymentPlans={paymentPlans}
        isLoading={isLoading}
        paymentsLoading={paymentsLoading}
        pagination={{ page, pageSize: rowsPerPage, total }}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleFetchPaymentPlans={handleFetchPaymentPlans}
        onEdit={handleEdit}
        onPaymentEdit={() => {}}
        onPaginationChange={() => {}}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterStartDate={filterStartDate}
        setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate}
        setFilterEndDate={setFilterEndDate}
        handleStatusChange={handleStatusFilterChange}
      />
      <PaymentsPlanDialog
        open={open}
        onClose={handleClose}
        cuotas={parseInt(cuotas) | 0}
        onSubmit={handleSubmit}
        paymentPlan={newPaymentPlan}
        payments={payments}
        status={status}
        comprobanteDialogOpen={comprobanteDialogOpen}
        handleChange={handleChange}
        isEditing={!!selectedPaymentPlan}
        paymentIndex={paymentIndex ?? 0}
        handleEditPayment={handleEditPayment}
        isEditingPayment={isEditingPayment}
        setIsEditingPayment={setIsEditingPayment}
        handleEditPaymentInput={handleEditPaymentInput}
        selectedPayment={selectedPayment}
        selectedIndex={selectedIndex}
        handleStatusChange={handleStatusChange}
        handleCloseComprobanteDialog={handleCloseComprobanteDialog}
        handleOpenComprobanteDialog={handleOpenComprobanteDialog}
        handleUploadComprobante={handleUploadComprobante}
        montoPago={montopago}
        fechaPago={fechapago}
        setFechaPago={setFechaPago}
        setMontoPago={setMontoPago}
        setPayments={setPayments}
        searchLoading={searchLoading}
        searchQuery={searchQuery}
        patients={patients}
        handleClearSearch={handleClearSearch}
        handlePatientSelect={handlePatientSelect}
        setSearchQuery={setSearchQuery}
        setShouldSearch={setShouldSearch}
        shouldSearch={shouldSearch}
        fechaCreacionError={fechaCreacionError}
        fechaLimiteError={fechaLimiteError}
        montoError={montoError}
        descripcionError={descripcionError}
        pacienteError={pacienteError}
        cuotasError={cuotasError}
      />

      <SnackbarAlert
        snackbar={snackbar}
        onClose={handleSnackbarClose}
      />
    </Paper>
    
  );
}