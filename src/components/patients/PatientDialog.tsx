import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material';
import { PatientDTO } from '@/domain/entities/Patient';

interface PatientDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  patient: PatientDTO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  handleBooleanChange: (name: keyof PatientDTO) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

export default function PatientDialog({
  open,
  onClose,
  onSubmit,
  patient,
  handleChange,
  handleBooleanChange,
  handleDateChange,
  isEditing
}: PatientDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Paciente' : 'Añadir Paciente'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              id="nombres"
              name="nombres"
              label="Nombres"
              type="text"
              fullWidth
              value={patient.nombres}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              id="apellidos"
              name="apellidos"
              label="Apellidos"
              type="text"
              fullWidth
              value={patient.apellidos}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              id="direccion"
              name="direccion"
              label="Dirección"
              type="text"
              fullWidth
              value={patient.direccion}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              id="telefonodomicilio"
              name="telefonodomicilio"
              label="Teléfono Domicilio"
              type="text"
              fullWidth
              value={patient.telefonodomicilio || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              id="telefonopersonal"
              name="telefonopersonal"
              label="Teléfono Personal"
              type="text"
              fullWidth
              value={patient.telefonopersonal}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              id="lugarnacimiento"
              name="lugarnacimiento"
              label="Lugar de Nacimiento"
              type="text"
              fullWidth
              value={patient.lugarnacimiento || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              id="fechanacimiento"
              name="fechanacimiento"
              label="Fecha de Nacimiento"
              type="date"
              fullWidth
              value={patient.fechanacimiento || ''}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().split('T')[0] // No permite fechas futuras
              }}
              // Este campo es importante para depuración
              helperText={patient.fechanacimiento ? `Fecha seleccionada: ${patient.fechanacimiento}` : 'Sin fecha seleccionada'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={patient.sexo}
                  onChange={handleBooleanChange('sexo')}
                  name="sexo"
                />
              }
              label={patient.sexo ? 'Masculino' : 'Femenino'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="estadocivil-label">Estado Civil</InputLabel>
              <Select
                labelId="estadocivil-label"
                id="estadocivil"
                name="estadocivil"
                value={patient.estadocivil}
                label="Estado Civil"
                onChange={handleChange} // solucionar !!
                required
              >
                <MenuItem value="Soltero">Soltero</MenuItem>
                <MenuItem value="Casado">Casado</MenuItem>
                <MenuItem value="Divorciado">Divorciado</MenuItem>
                <MenuItem value="Viudo">Viudo</MenuItem>
                <MenuItem value="Unión Libre">Unión Libre</MenuItem>
                <MenuItem value="Separado">Separado</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              id="ocupacion"
              name="ocupacion"
              label="Ocupación"
              type="text"
              fullWidth
              value={patient.ocupacion}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              id="aseguradora"
              name="aseguradora"
              label="Aseguradora"
              type="text"
              fullWidth
              value={patient.aseguradora || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onSubmit} color="primary">
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}