'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  CircularProgress,
  Box
} from '@mui/material';
import { Edit as EditIcon, } from '@mui/icons-material';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { Payment } from '@/domain/entities/Payments'

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

interface PaymentPlansTableProps {
  paymentPlans: PaymentPlan[];
  isLoading: boolean;
  paymentsLoading: boolean;
  pagination: Pagination;
  onEdit: (idPaymentPlan: number) => void;
  onPaymentEdit: (paymentPlan: PaymentPlan) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
  handleChangePage: (event: unknown, newPage:number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PaymentPlansTable({
  paymentPlans,
  isLoading,
  paymentsLoading,
  pagination,
  onEdit,
  onPaymentEdit,
  onPaginationChange,
  handleChangePage,
  handleChangeRowsPerPage
}: PaymentPlansTableProps){

  if(isLoading){
    return(
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return(
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Fecha Creación</TableCell>
            <TableCell>Fecha Límite</TableCell>
            <TableCell>Monto Total</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            Array.isArray(paymentPlans) && paymentPlans.length > 0 ? (
              paymentPlans.map((paymentPlan)=>{
                return(
                  <TableRow key={paymentPlan.idplanpago}>
                    <TableCell>{paymentPlan.idplanpago}</TableCell>
                    <TableCell>
                      {new Date(paymentPlan.fechacreacion).getDate()}/
                      {new Date(paymentPlan.fechacreacion).getMonth() + 1}/
                      {new Date(paymentPlan.fechacreacion).getFullYear()}
                    </TableCell>

                    <TableCell>
                      {new Date(paymentPlan.fechalimite).getDate()}/
                      {new Date(paymentPlan.fechalimite).getMonth() + 1}/
                      {new Date(paymentPlan.fechalimite).getFullYear()}
                    </TableCell>
                    <TableCell>{paymentPlan.montotal} bs.</TableCell>
                    <TableCell>{paymentPlan.descripcion}</TableCell>
                    <TableCell>{paymentPlan.estado}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onEdit(paymentPlan.idplanpago)} color="primary" aria-label="editar">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay planes de pago disponibles
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pagination.total} 
        rowsPerPage={pagination.pageSize}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}