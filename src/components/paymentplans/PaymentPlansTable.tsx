'use client';
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Stack,
  Pagination,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import { Edit as EditIcon, } from '@mui/icons-material';
import { PaymentPlan } from '@/domain/entities/PaymentsPlan';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
  handleStatusChange: (event: SelectChangeEvent) => void;
  handleFetchPaymentPlans: () => void;

  //filtros
  filterStatus: string;
  filterStartDate: string;
  filterEndDate: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string | ''>>;
  setFilterStartDate: React.Dispatch<React.SetStateAction<string | ''>>;
  setFilterEndDate: React.Dispatch<React.SetStateAction<string | ''>>;
  
}

export default function PaymentPlansTable({
  paymentPlans,
  isLoading,
  pagination,
  onEdit,
  handleChangePage,
  filterStatus,
  filterStartDate,
  filterEndDate,
  setFilterStartDate,
  setFilterEndDate,
  handleStatusChange,
  handleFetchPaymentPlans
}: PaymentPlansTableProps){

  const getStatusChipColor = (
    estado: string
  ): { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } => {
    switch (estado.toLowerCase()) {
      case "completado":
        return { label: "COMPLETO", color: "success" };
      case "pendiente":
        return { label: "PENDIENTE", color: "warning" };
      case "cancelado":
        return { label: "CANCELADO", color: "default" };
      default:
        return { label: estado.toUpperCase(), color: "primary" };
    }
  };


  if(isLoading){
    return(
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Pagos
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
          {/* Estado */}
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              value={filterStatus}
              label="Estado"
              onChange={handleStatusChange}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Completado">Completado</MenuItem>
            </Select>
          </FormControl>

          {/* Fecha inicio */}
          <DatePicker
            label="Fecha inicio"
            value={filterStartDate ? new Date(filterStartDate) : null}
            onChange={(date) => setFilterStartDate(date ? date.toISOString() : '')}
            slotProps={{ textField: { size: 'small' } }}
          />

          {/* Fecha fin */}
          <DatePicker
            label="Fecha fin"
            value={filterEndDate ? new Date(filterEndDate) : null}
            onChange={(date) => setFilterEndDate(date ? date.toISOString() : '')}
            slotProps={{ textField: { size: 'small' } }}
          />
          <Button
            onClick={handleFetchPaymentPlans}
            variant="contained"
          >
            Filtrar
          </Button>
        </Box>
        
      </LocalizationProvider>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {paymentPlans.map((plan) => {
          const { label, color } = getStatusChipColor(plan.estado);
          const fecha = new Date(plan.fechacreacion);
          const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

          return (
            <Box key={plan.idplanpago} width={{ xs: "100%", sm: "48%", md: "31%" }}>
              <Card variant="outlined" sx={{ position: "relative" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="primary" fontWeight="bold">
                    Fecha de creación: &nbsp; {formattedDate}
                  </Typography>

                  <Chip
                    label={label}
                    color={color}
                    size="small"
                    sx={{ position: "absolute", top: 16, right: 16 }}
                  />

                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      Descripción:
                    </Typography>
                    <Typography variant="body2">{plan.descripcion}</Typography>
                  </Box>

                  <Box mt={1} display="flex" flexWrap="wrap" gap={4}>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="caption" color="text.secondary">
                        Monto total:
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {plan.montotal} bs.
                      </Typography>
                    </Box>

                    <Box display="flex" flexDirection="column">
                      <Typography variant="caption" color="text.secondary">
                        Monto pagado:
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {plan.montopagado} bs.
                      </Typography>
                    </Box>
                  </Box>

                  <Box mt={1} display="flex" flexWrap="wrap" justifyContent="space-between" >
                    <Box display="flex" flexDirection="column">
                      <Typography variant="caption" color="text.secondary">
                        Fecha límite:
                      </Typography>
                      <Typography variant="body2">
                        {new Date(plan.fechalimite).getDate()}/
                        {new Date(plan.fechalimite).getMonth() + 1}/
                        {new Date(plan.fechalimite).getFullYear()}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="flex-end">
                      <IconButton
                        onClick={() => onEdit(plan.idplanpago)}
                        color="primary"
                        sx={{ mt: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
      <Stack spacing={2} alignItems="center" mt={2}>
        <Pagination
          count={Math.ceil(pagination.total / 10)}
          page={pagination.page + 1}              
          onChange={(event, value) => handleChangePage(null, value - 1)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Stack>
      
      
    </Box>
  );
};