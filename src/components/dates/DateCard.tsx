'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import
  {useEffect}
from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import {
  Box,
  Chip,
  CircularProgress,
  Grid
}from '@mui/material'

import { Edit, Delete, Restore, DeleteForever } from '@mui/icons-material';
import { Date as DateObj} from '@/domain/entities/Dates';
import { StatusDropDown } from '@/components/dates/StatusDropDown';
import { updateDateStatus } from '@/application/usecases/dates';
import { Status } from '@/domain/entities/Status';
import { fetchStatus } from '@/application/usecases/status'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateTime } from 'next-auth/providers/kakao';

interface DatesProps {
  dates: DateObj[];
  isLoading: boolean;
  showDisabled: boolean;
  onEdit: (date: DateObj) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
  onUpdate: () => void;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export function DateCard({
  dates,
  isLoading,
  showDisabled,
  onEdit,
  onDelete,
  onRestore,
  onDeletePermanently,
  onUpdate
}: DatesProps) {
  const [status, setStatus] = React.useState<Status[]>([]);
  const [expandedCardId, setExpandedCardId] = React.useState<number | null>(null);

  const router = useRouter();

  const handleExpandClick = (id: number) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };
  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = await fetchStatus();
      setStatus(statuses);
    };
  
    fetchStatuses();
  }, []);
  
  const handleStatusChange = async (idcita: number, newStatus: number) => {
    try {
      await updateDateStatus(idcita, newStatus);
      onUpdate();
    } catch (error) {
      console.error('Error actualizando estado:', error);
    } 
  };

  const handleCalendarClick = (fechacita: DateTime) =>{
    router.push(`calendar?date=${fechacita}`);
  };

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

  
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (dates.length === 0 && !isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          {showDisabled ? 'No hay fechas inhabilitadas' : 'No hay fechas disponibles'}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {dates.map((date, index) => {
        const { label, color } = getStatusChipColor(date.estado);
        return(
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ maxWidth: 345, width: '100%' }}>
            <CardHeader
              avatar={
                <Avatar>
                  <WatchLaterIcon />
                </Avatar>
              }
              action={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Chip
                    label={label}
                    color={color}
                    size="small"
                  />
                  <IconButton aria-label="settings" onClick={() => handleCalendarClick(date.fechacita)}>
                    <CalendarMonthIcon />
                  </IconButton>
                </Box>
              }
              title={date.descripcion}
            />


            <CardContent>
              <PersonIcon/> {date.paciente}
            </CardContent>

            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 1, pb: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                  <TodayIcon />
                  <Typography>
                    {
                      (() => {
                        try {
                          const adjustedDate = new Date(date.fechacita); // Restar 4 horas
                          return format(adjustedDate, "d 'de' MMMM 'de' yyyy", { locale: es });
                        } catch {
                          return 'Fecha no disponible';
                        }
                      })()
                    }
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon />
                  <Typography>
                    {
                      (() => {
                        const start = new Date(date.fechacita);
                        const end = new Date(start.getTime() + date.duracionaprox * 60 * 60 * 1000);
                        try{
                          return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
                        } catch{
                          return "Fecha no disponible";
                        }
                        
                      })()
                    }
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions disableSpacing>
              {!showDisabled ? (
                <>
                  <IconButton color="primary" onClick={() => onEdit(date)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(date.idcita)}>
                    <Delete />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton color="primary" onClick={() => onRestore(date.idcita)} title="Restaurar Cita">
                    <Restore />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDeletePermanently(date.idcita)} title="Eliminar Permanentemente">
                    <DeleteForever />
                  </IconButton>
                  
                </>
              )}
              <ExpandMore
                expand={expandedCardId === date.idcita}
                onClick={()=> handleExpandClick(date.idcita)}
                aria-expanded={expandedCardId === date.idcita}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>

              <Collapse in={expandedCardId===date.idcita} timeout="auto" unmountOnExit>
              <CardContent>
              <StatusDropDown
                idcita={date.idcita}
                isDropDownLoading={isLoading}
                status={status}
                selectedStatus={date.idestado}
                onChange={async (idcita, newStatus) => {
                  if (idcita !== null) {
                    try {
                      await handleStatusChange(idcita, newStatus);
                    } catch (error) {
                      console.error("Error al actualizar estado", error);
                    }
                  }
                }}
              />
              </CardContent>
              {(()=> {
                if(date.fechaconsulta != null){
                    return (
                      <CardContent>
                        <Typography>
                          Consulta: {format(new Date(date.fechaconsulta), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </Typography>
                      </CardContent>
                    );
                }
              })()}
              
              <CardContent>
                <Typography>
                {
                  (() => {
                    try {
                      return `Fecha de registro: ${format(new Date(date.fecha), "d 'de' MMMM 'de' yyyy", { locale: es })}`;
                    } catch {
                      return 'Fecha no disponible';
                    }
                  })()
                }
                  
                </Typography>
              </CardContent>
              <CardContent>
                <Typography>
                  Duración Aproximada: {String(Math.floor(date.duracionaprox)).padStart(2, '0')} : {String(Math.round((date.duracionaprox * 60) % 60)).padStart(2, '0')} hora(s)
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
    )
    })}
    </Grid>
  );
}

export default DateCard;
