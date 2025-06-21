'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Person as PersonIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface ReportItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: 'financiero' | 'pacientes' | 'programacion' | 'clinico';
  isActive: boolean;
}

const reportsData: ReportItem[] = [
  {
    id: 'pagos-pacientes',
    title: 'Pagos por Pacientes',
    description: 'Reporte detallado de pagos realizados por cada paciente',
    icon: <PaymentIcon />,
    path: '/reports/paymentsPlanReport',
    category: 'financiero',
    isActive: true
  },
//   {
//     id: 'ingresos-mensuales',
//     title: 'Ingresos Mensuales',
//     description: 'Análisis de ingresos por mes y comparativa anual',
//     icon: <TrendingUpIcon />,
//     path: '/reportes/ingresos-mensuales',
//     category: 'financiero',
//     isActive: false
//   },
  {
    id: 'pacientes-activos',
    title: 'Pacientes Activos',
    description: 'Lista de pacientes con citas recientes y estado de tratamiento',
    icon: <PersonIcon />,
    path: '/reportes/pacientes-activos',
    category: 'pacientes',
    isActive: false
  },
  {
    id: 'citas-programadas',
    title: 'Citas Programadas',
    description: 'Reporte de citas por período con estado y seguimiento',
    icon: <EventNoteIcon />,
    path: '/reportes/citas-programadas',
    category: 'programacion',
    isActive: false
  },
  // {
  //   id: 'ocupacion-agenda',
  //   title: 'Ocupación de Agenda',
  //   description: 'Análisis de utilización de horarios y disponibilidad',
  //   icon: <ScheduleIcon />,
  //   path: '/reportes/ocupacion-agenda',
  //   category: 'operacional',
  //   isActive: false
  // },
//   {
//     id: 'facturas-pendientes',
//     title: 'Facturas Pendientes',
//     description: 'Reporte de facturas por cobrar y gestión de cartera',
//     icon: <ReceiptIcon />,
//     path: '/reportes/facturas-pendientes',
//     category: 'financiero',
//     isActive: false
//   },
//   {
//     id: 'estadisticas-tratamientos',
//     title: 'Estadísticas de Tratamientos',
//     description: 'Análisis de tipos de tratamientos más solicitados',
//     icon: <AssessmentIcon />,
//     path: '/reportes/estadisticas-tratamientos',
//     category: 'clinico',
//     isActive: false
//   },
//   {
//     id: 'dashboard-ejecutivo',
//     title: 'Dashboard Ejecutivo',
//     description: 'Resumen ejecutivo con KPIs principales del negocio',
//     icon: <AnalyticsIcon />,
//     path: '/reportes/dashboard-ejecutivo',
//     category: 'operacional',
//     isActive: false
//   }
];

const categoryColors = {
  financiero: '#2E7D32',
  pacientes: '#1976D2', 
  programacion: '#F57C00',
  clinico: '#7B1FA2'
} as const;

const categoryLabels = {
  financiero: 'Financiero',
  pacientes: 'Pacientes',
  programacion: 'Programación',
  clinico: 'Clínico'
} as const;

export default function ReportsMenu() {
  const router = useRouter();
  const theme = useTheme();

  const handleNavigateToReport = (path: string) => {
    router.push(path);
  };

  const groupedReports = reportsData.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, ReportItem[]>);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Reportes del Sistema
      </Typography>

      {Object.entries(groupedReports).map(([category, reports]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              mb: 3,
              color: categoryColors[category as keyof typeof categoryColors],
              borderBottom: `2px solid ${categoryColors[category as keyof typeof categoryColors]}`,
              paddingBottom: 1
            }}
          >
            {categoryLabels[category as keyof typeof categoryLabels]}
          </Typography>
          
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                    ...(report.isActive && {
                      borderLeft: `4px solid ${categoryColors[report.category]}`,
                      backgroundColor: alpha(categoryColors[report.category], 0.05)
                    })
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          color: categoryColors[report.category],
                          mr: 2,
                          '& svg': { fontSize: 28 }
                        }}
                      >
                        {report.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {report.title}
                        </Typography>
                        {report.isActive && (
                          <Chip 
                            label="Activo" 
                            size="small" 
                            color="success" 
                            sx={{ mb: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      {report.description}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant={report.isActive ? "contained" : "outlined"}
                      color="primary"
                      fullWidth
                      onClick={() => handleNavigateToReport(report.path)}
                      disabled={!report.isActive}
                      sx={{
                        ...(report.isActive && {
                          backgroundColor: categoryColors[report.category],
                          '&:hover': {
                            backgroundColor: alpha(categoryColors[report.category], 0.8)
                          }
                        })
                      }}
                    >
                      {report.isActive ? 'Ver Reporte' : 'Todavia no esta implementado'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}