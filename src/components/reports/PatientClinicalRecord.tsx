import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  MedicalServices as MedicalIcon,
  LocalHospital as LocalHospitalIcon,
  FitnessCenter as FitnessCenterIcon,
  Medication as MedicationIcon,
  Healing as HealingIcon,
  ExpandMore as ExpandMoreIcon,
  PregnantWoman as PregnantIcon,
  PersonOff as PersonOffIcon
} from '@mui/icons-material';
import { Patient } from '@/domain/entities/Patient';
import { AntecedenteCompleto } from '@/domain/entities/Antecedent';
import { Illness } from '@/domain/entities/Illnesses';
import { Habit } from '@/domain/entities/Habits';
import { Medication } from '@/domain/entities/Medications';
import { MedicalAttention } from '@/domain/entities/MedicalAttentions';

interface PatientClinicalRecordProps {
  patient: Patient;
  antecedentes: AntecedenteCompleto[];
  enfermedades: Illness[];
  habitos: Habit[];
  medicaciones: Medication[];
  atencionesMedicas: MedicalAttention[];
  loading?: boolean;
}

// Función para calcular la edad
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Función para formatear fechas
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const PatientClinicalRecord: React.FC<PatientClinicalRecordProps> = ({
  patient,
  antecedentes,
  enfermedades,
  habitos,
  medicaciones,
  atencionesMedicas,
  loading = false
}) => {
  if (loading) {
    return <Typography>Cargando ficha clínica...</Typography>;
  }

  const age = patient.fechanacimiento ? calculateAge(patient.fechanacimiento) : null;
  const formattedBirthDate = patient.fechanacimiento ? formatDate(patient.fechanacimiento) : 'No registrada';

  // Función para obtener enfermedades por antecedente
  const getEnfermedadesByAntecedente = (antecedenteId: number): Illness[] => {
    const antecedente = antecedentes.find(ant => ant.idantecedente === antecedenteId);
    if (!antecedente?.enfermedades) return [];
    
    return enfermedades.filter(enf => 
      antecedente.enfermedades.includes(enf.idenfermedad)
    );
  };

  // Función para obtener hábitos por antecedente
  const getHabitosByAntecedente = (antecedenteId: number): Habit[] => {
    const antecedente = antecedentes.find(ant => ant.idantecedente === antecedenteId);
    if (!antecedente?.habitos) return [];
    
    return habitos.filter(hab => 
      antecedente.habitos.includes(hab.idhabito)
    );
  };

  // Función para obtener medicaciones por antecedente
  const getMedicacionesByAntecedente = (antecedenteId: number): Medication[] => {
    const antecedente = antecedentes.find(ant => ant.idantecedente === antecedenteId);
    if (!antecedente?.medicaciones) return [];
    
    return medicaciones.filter(med => 
      antecedente.medicaciones.includes(med.idmedicacion)
    );
  };

  // Función para obtener atenciones médicas por antecedente
  const getAtencionesByAntecedente = (antecedenteId: number): MedicalAttention[] => {
    const antecedente = antecedentes.find(ant => ant.idantecedente === antecedenteId);
    if (!antecedente?.atencionesMedicas) return [];
    
    return atencionesMedicas.filter(att => 
      antecedente.atencionesMedicas.includes(att.idatencionmedica)
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          FICHA CLÍNICA ODONTOLÓGICA
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Centro Médico Dental
        </Typography>
        <Divider sx={{ mt: 2, mb: 3 }} />
        <Typography variant="subtitle2" color="text.secondary">
          Fecha de generación: {formatDate(new Date().toISOString())}
        </Typography>
      </Box>

      {/* Información del Paciente */}
      <Card sx={{ mb: 4, elevation: 2 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
          }
          title={
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              INFORMACIÓN DEL PACIENTE
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Nombre Completo"
                    secondary={`${patient.nombres} ${patient.apellidos}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fecha de Nacimiento"
                    secondary={`${formattedBirthDate}${age ? ` (${age} años)` : ''}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sexo"
                    secondary={patient.sexo || 'No registrado'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Estado Civil"
                    secondary={patient.estadocivil || 'No registrado'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Lugar de Nacimiento"
                    secondary={patient.lugarnacimiento || 'No registrado'}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dirección"
                    secondary={patient.direccion || 'No registrada'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Teléfono Personal"
                    secondary={patient.telefonopersonal || 'No registrado'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Teléfono Domicilio"
                    secondary={patient.telefonodomicilio || 'No registrado'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Ocupación"
                    secondary={patient.ocupacion || 'No registrada'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <MedicalIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Aseguradora"
                    secondary={patient.aseguradora || 'No registrada'}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Historial Clínico */}
      <Card sx={{ elevation: 2 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <LocalHospitalIcon />
            </Avatar>
          }
          title={
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              HISTORIAL CLÍNICO ODONTOLÓGICO
            </Typography>
          }
          subheader={`Total de antecedentes: ${antecedentes.length}`}
        />
        <CardContent>
          {antecedentes.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay antecedentes médicos registrados para este paciente.
            </Alert>
          ) : (
            <Box>
              {antecedentes.map((antecedente, index) => (
                <Accordion 
                  key={antecedente.idantecedente || index}
                  sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'medium', mr: 2 }}>
                        Antecedente #{antecedente.idantecedente}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                        {antecedente.fecha ? formatDate(typeof antecedente.fecha === 'string' ? antecedente.fecha : antecedente.fecha.toISOString()) : 'Fecha no disponible'}
                      </Typography>
                      {antecedente.embarazo && (
                        <Chip 
                          icon={<PregnantIcon />}
                          label="Embarazo" 
                          color="secondary" 
                          size="small"
                          sx={{ ml: 'auto' }}
                        />
                      )}
                    </Box>
                  </AccordionSummary>
                  
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      {/* Estado de Embarazo */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {antecedente.embarazo ? (
                            <PregnantIcon color="secondary" sx={{ mr: 1 }} />
                          ) : (
                            <PersonOffIcon color="disabled" sx={{ mr: 1 }} />
                          )}
                          <Typography variant="body1">
                            <strong>Estado de embarazo:</strong> {antecedente.embarazo ? 'Sí' : 'No'}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Enfermedades */}
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, bgcolor: 'error.50' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocalHospitalIcon color="error" sx={{ mr: 1 }} />
                            <Typography variant="h6" color="error.main">
                              Enfermedades
                            </Typography>
                          </Box>
                          {antecedente.idantecedente && getEnfermedadesByAntecedente(antecedente.idantecedente).length > 0 ? (
                            <List dense>
                              {getEnfermedadesByAntecedente(antecedente.idantecedente).map((enfermedad) => (
                                <ListItem key={enfermedad.idenfermedad}>
                                  <ListItemText 
                                    primary={`• ${enfermedad.enfermedad}`}
                                    secondary={enfermedad.enfermedad}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No hay enfermedades registradas
                            </Typography>
                          )}
                        </Paper>
                      </Grid>

                      {/* Hábitos */}
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, bgcolor: 'warning.50' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FitnessCenterIcon color="warning" sx={{ mr: 1 }} />
                            <Typography variant="h6" color="warning.main">
                              Hábitos
                            </Typography>
                          </Box>
                          {antecedente.idantecedente && getHabitosByAntecedente(antecedente.idantecedente).length > 0 ? (
                            <List dense>
                              {getHabitosByAntecedente(antecedente.idantecedente).map((habito) => (
                                <ListItem key={habito.idhabito}>
                                  <ListItemText 
                                    primary={`• ${habito.habito}`}
                                    secondary={habito.habito}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No hay hábitos registrados
                            </Typography>
                          )}
                        </Paper>
                      </Grid>

                      {/* Medicaciones */}
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MedicationIcon color="info" sx={{ mr: 1 }} />
                            <Typography variant="h6" color="info.main">
                              Medicaciones
                            </Typography>
                          </Box>
                          {antecedente.idantecedente && getMedicacionesByAntecedente(antecedente.idantecedente).length > 0 ? (
                            <List dense>
                              {getMedicacionesByAntecedente(antecedente.idantecedente).map((medicacion) => (
                                <ListItem key={medicacion.idmedicacion}>
                                  <ListItemText 
                                    primary={`• ${medicacion.medicacion}`}
                                    secondary={`${medicacion.medicacion}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No hay medicaciones registradas
                            </Typography>
                          )}
                        </Paper>
                      </Grid>

                      {/* Atenciones Médicas */}
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <HealingIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="h6" color="success.main">
                              Atenciones Médicas
                            </Typography>
                          </Box>
                          {antecedente.idantecedente && getAtencionesByAntecedente(antecedente.idantecedente).length > 0 ? (
                            <List dense>
                              {getAtencionesByAntecedente(antecedente.idantecedente).map((atencion) => (
                                <ListItem key={atencion.idatencionmedica}>
                                  <ListItemText 
                                    primary={`• ${atencion.atencion}`}
                                    secondary={atencion.atencion}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No hay atenciones médicas registradas
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};