'use client';
import PaymentPlansTable from "./PaymentPlansTable";
import usePaymentPlanHandlers from "@/presentation/handlers/usePaymentPlanHandlers";
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

    handleFetchPaymentPlans,
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
    setIsEditingPayment
  } = usePaymentPlanHandlers();

  
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
        onEdit={handleEdit}
        onPaymentEdit={() => {}}
        onPaginationChange={() => {}}
      />
      <PaymentsPlanDialog
        open={open}
        onClose={handleClose}
        cuotas={cuotas}
        onSubmit={handleSubmit}
        paymentPlan={newPaymentPlan}
        payments={payments}
        handleChange={handleChange}
        isEditing={!!selectedPaymentPlan}
        handleEditPayment={handleEditPayment}
        isEditingPayment={isEditingPayment}
        setIsEditingPayment={setIsEditingPayment}
        handleEditPaymentInput={handleEditPaymentInput}
      />

      <SnackbarAlert
        snackbar={snackbar}
        onClose={handleSnackbarClose}
      />
    </Paper>
    
  );
}