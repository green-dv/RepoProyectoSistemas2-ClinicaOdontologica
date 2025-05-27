import React from 'react';
import { PatientDialog } from './PatientDialog';
import AntecedenteDialog from '@/components/antecedent/AntecedentPatientSection';
import {
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  MedicalServices as MedicalIcon,
  EditOutlined as EditIcon,
  LocalHospital as LocalHospitalIcon,
  FitnessCenter as FitnessCenterIcon,
  Medication as MedicationIcon,
  Healing as HealingIcon,
  AddCircleOutline as AddIcon
} from '@mui/icons-material';

import { PatientViewDialogProps } from './viewUtils/PatientViewTypes';
import { TabPanel } from './viewUtils/PatientViewComponent';
import { usePatientView } from '@/presentation/hooks/usePatientView';
import { usePatientViewHandlers } from '@/presentation/handlers/usePatientView';
import { calculateAge, formatDate, getEmbarazoIcon, getEmbarazoLabel } from './viewUtils/PatientViewUtils';

export const PatientViewDialog: React.FC<PatientViewDialogProps> = ({
  open,
  onClose,
  patient,
  onEdit,
  onAddAntecedent = () => {}
}) => {
  const hookData = usePatientView(patient);
  
  const {
    antecedentes,
    showAntecedentes,
    loadingAntecedentes,
    loadingError,
    tabValue,
    currentAntecedente,
    enfermedades,
    habitos,
    medicaciones,
    atencionesMedicas,
    currentPatientId,
    loadingRelatedData,
    openAddAntecedenteDialog,
    openEditAntecedenteDialog,
    selectedAntecedente
  } = hookData;

  // obtener los handlers
  // para manejar los eventos y acciones del componente
  const handlers = usePatientViewHandlers({
    patient,
    hookData,
    onAddAntecedent
  });

  if (!patient) {
    return null;
  }

  const formattedBirthDate = patient.fechanacimiento 
    ? formatDate(patient.fechanacimiento)
    : 'No registrada';

  // para la edad
  const age = calculateAge(patient.fechanacimiento);
  return (
    <>
      <PatientDialog
        open={open}
        onClose={onClose}
        title="Información del Paciente"
        maxWidth="md"
        showActions={false}
      >
        <Box sx={{ pb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              {patient.nombres} {patient.apellidos}
            </Typography>
            <Chip 
              label={patient.habilitado ? 'Activo' : 'Inactivo'} 
              color={patient.habilitado ? 'success' : 'error'} 
              size="medium"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Patient details */}
          <Grid container spacing={3}>
            {/* Inforamacion personal */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1,
                  fontWeight: 'bold'
                }}>
                  <PersonIcon sx={{ mr: 1 }} /> Información Personal
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Sexo
                    </Typography>
                    <Typography variant="body1">
                      {patient.sexo ? 'Masculino' : 'Femenino'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Estado Civil
                    </Typography>
                    <Typography variant="body1">
                      {patient.estadocivil || 'No registrado'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Nacimiento
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarIcon sx={{ mr: 0.5, fontSize: "small", color: "text.secondary" }} />
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        {formattedBirthDate}
                      </Typography>
                      {age !== null && (
                        <Chip 
                          label={`${age} años`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Lugar de Nacimiento
                    </Typography>
                    <Typography variant="body1">
                      {patient.lugarnacimiento || 'No registrado'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Informacion de contacto */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1,
                  fontWeight: 'bold'
                }}>
                  <PhoneIcon sx={{ mr: 1 }} /> Información de Contacto
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono Personal
                    </Typography>
                    <Typography variant="body1">
                      {patient.telefonopersonal || 'No registrado'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono Domicilio
                    </Typography>
                    <Typography variant="body1">
                      {patient.telefonodomicilio || 'No registrado'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Dirección
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationIcon sx={{ mr: 0.5, fontSize: 'small', color: 'text.secondary', mt: 0.3 }} />
                      {patient.direccion || 'No registrada'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Extra informacion */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      display: 'flex', 
                      alignItems: 'center'
                    }}>
                      <WorkIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                      Ocupación
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 3 }}>
                      {patient.ocupacion || 'No registrada'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      display: 'flex', 
                      alignItems: 'center'
                    }}>
                      <MedicalIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                      Aseguradora
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 3 }}>
                      {patient.aseguradora || 'No registrada'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Cerrar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<MedicalIcon />}
              onClick={handlers.fetchAntecedentes}
              disabled={loadingAntecedentes}
            >
              {loadingAntecedentes ? 'Cargando...' : 'Ver Antecedentes'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={onEdit}
            >
              Editar Paciente
            </Button>
          </Box>

          
          {/* Seccion de Antecedentes */}
          {showAntecedentes && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '2px solid #3f51b5',
                pb: 1,
                mb: 2
              }}>
                <Typography variant="h6" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                }}>
                  <MedicalIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Antecedentes Médicos
                </Typography>
                
                {/* Botón para añadir antecedentes  */}
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={handlers.handleOpenAddAntecedenteDialog}
                  size="small"
                >
                  Agregar Antecedente
                </Button>
              </Box>

              {loadingAntecedentes ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : loadingError ? (
                <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Typography color="error">{loadingError}</Typography>
                </Box>
              ) : antecedentes.length === 0 ? (
                <Paper elevation={1} sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <MedicalIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" sx={{ mb: 2 }}>No hay antecedentes registrados para este paciente.</Typography>
                  
                  {/* Boton para agregar un antecedente en caso de que el paciente no tenga uno */}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handlers.handleOpenAddAntecedenteDialog}
                  >
                    Agregar Primer Antecedente
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {/* Historial de antecedentes //sidebar */}
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      height: '100%'
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          p: 1.5, 
                          fontWeight: 'bold' 
                        }}
                      >
                        Historial de Antecedentes
                      </Typography>
                      <List sx={{ p: 0 }}>
                        {antecedentes.map((antecedente, index) => (
                          <ListItem 
                            key={antecedente.idantecedente || index}
                            component="button"
                            divider
                            selected={currentAntecedente?.idantecedente === antecedente.idantecedente}
                            onClick={() => handlers.handleSelectAntecedente(antecedente)}
                            sx={{ 
                              '&.Mui-selected': { 
                                bgcolor: 'primary.light',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                }
                              }
                            }}
                          >
                            <ListItemIcon>
                              {getEmbarazoIcon(antecedente.embarazo)}
                            </ListItemIcon>
                            <ListItemText 
                              primary={`Antecedente #${antecedente.idantecedente}`}
                              secondary={formatDate(antecedente.fecha)}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>

                  {/* Detalles del antecedente seleccionado */}
                  <Grid item xs={12} md={8}>
                    {currentAntecedente ? (
                      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ 
                            bgcolor: 'primary.main', 
                            p: 2,
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                              Detalle de Antecedente ({formatDate(currentAntecedente.fecha)})
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              {getEmbarazoIcon(currentAntecedente.embarazo)}
                              <Typography variant="body1" sx={{ ml: 1 }}>
                                Embarazo: {getEmbarazoLabel(currentAntecedente.embarazo)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {/* Botón de Editar */}
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<EditIcon />}
                            onClick={() => handlers.handleOpenEditAntecedenteDialog(currentAntecedente)}
                            size="small"
                            sx={{ bgcolor: 'secondary.light', '&:hover': { bgcolor: 'secondary.main' } }}
                          >
                            Editar
                          </Button>
                        </Box>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs value={tabValue} onChange={handlers.handleChangeTab} aria-label="antecedent details tabs">
                            <Tab 
                              icon={<LocalHospitalIcon />} 
                              iconPosition="start" 
                              label="Enfermedades" 
                              id="antecedent-tab-0" 
                              aria-controls="antecedent-tabpanel-0" 
                            />
                            <Tab 
                              icon={<FitnessCenterIcon />} 
                              iconPosition="start" 
                              label="Hábitos" 
                              id="antecedent-tab-1" 
                              aria-controls="antecedent-tabpanel-1" 
                            />
                            <Tab 
                              icon={<MedicationIcon />} 
                              iconPosition="start" 
                              label="Medicaciones" 
                              id="antecedent-tab-2" 
                              aria-controls="antecedent-tabpanel-2" 
                            />
                            <Tab 
                              icon={<HealingIcon />} 
                              iconPosition="start" 
                              label="Atenciones" 
                              id="antecedent-tab-3" 
                              aria-controls="antecedent-tabpanel-3" 
                            />
                          </Tabs>
                        </Box>

                        {loadingRelatedData ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                          </Box>
                        ) : (
                          <>
                            <TabPanel value={tabValue} index={0}>
                              {enfermedades.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                  <LocalHospitalIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                  <Typography>No hay enfermedades registradas</Typography>
                                </Box>
                              ) : (
                                <List>
                                  {enfermedades.map((enfermedad) => (
                                    <ListItem key={enfermedad.idenfermedad}>
                                      <ListItemIcon>
                                        <LocalHospitalIcon color="error" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={enfermedad.enfermedad}
                                        secondary={enfermedad.enfermedad || 'Sin descripción'}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                              {habitos.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                  <FitnessCenterIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                  <Typography>No hay hábitos registrados</Typography>
                                </Box>
                              ) : (
                                <List>
                                  {habitos.map((habito) => (
                                    <ListItem key={habito.idhabito}>
                                      <ListItemIcon>
                                        <FitnessCenterIcon color="info" />
                                      </ListItemIcon>
                                      <ListItemText primary={habito.habito} />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                              {medicaciones.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                  <MedicationIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                  <Typography>No hay medicaciones registradas</Typography>
                                </Box>
                              ) : (
                                <List>
                                  {medicaciones.map((medicacion) => (
                                    <ListItem key={medicacion.idmedicacion}>
                                      <ListItemIcon>
                                        <MedicationIcon color="success" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={medicacion.medicacion}
                                        secondary={medicacion.medicacion || 'Sin dosis especificada'}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                            </TabPanel>

                            <TabPanel value={tabValue} index={3}>
                              {atencionesMedicas.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                  <HealingIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                  <Typography>No hay atenciones médicas registradas</Typography>
                                </Box>
                              ) : (
                                <List>
                                  {atencionesMedicas.map((atencion) => (
                                    <ListItem key={atencion.idatencionmedica}>
                                      <ListItemIcon>
                                        <HealingIcon color="warning" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={atencion.atencion}
                                        secondary={atencion.atencion || 'Sin descripción'}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                            </TabPanel>
                          </>
                        )}
                      </Paper>
                    ) : (
                      <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                          Seleccione un antecedente para ver detalles
                        </Typography>
                      </Paper>
                    )}
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </PatientDialog>

      {/* Diálogo para agregar un nuevo antecedente */}
      <AntecedenteDialog 
        open={openAddAntecedenteDialog}
        onClose={handlers.handleCloseAddAntecedenteDialog}
        pacienteId={currentPatientId}
        antecedente={null} // Para crear un nuevo antecedente
        onAntecedenteAdded={handlers.handleAntecedenteAdded}
        onAntecedenteUpdated={handlers.handleAntecedenteUpdated}
        mode="add"
        title="Agregar Antecedente"
      />

      {/* Diálogo para editar un antecedente existente */}
      <AntecedenteDialog 
        open={openEditAntecedenteDialog}
        onClose={handlers.handleCloseEditAntecedenteDialog}
        pacienteId={currentPatientId}
        antecedente={selectedAntecedente} // Antecedente a editar
        onAntecedenteAdded={handlers.handleAntecedenteAdded}
        onAntecedenteUpdated={handlers.handleAntecedenteUpdated}
        mode="edit"
        title="Editar Antecedente"
      />
    </>
  );
};