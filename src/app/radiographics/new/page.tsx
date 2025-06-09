'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Input,
  useTheme,
  alpha
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';

export default function NewRadiographicEntryPage() {
  const theme = useTheme();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!imageFile || !description) {
      alert('Por favor selecciona una imagen y escribe una descripción.');
      return;
    }

    // Aquí puedes enviar los datos a tu backend
    alert(`Simulación: imagen '${imageFile.name}' registrada con descripción.`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Nueva Radiografía
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderLeft: `4px solid #7B1FA2`,
              backgroundColor: alpha('#7B1FA2', 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <UploadFileIcon sx={{ color: '#7B1FA2', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#7B1FA2' }}>
                  Seleccionar Imagen
                </Typography>
              </Box>

              <Input
                type="file"
                onChange={handleImageChange}
                inputProps={{ accept: 'image/*' }}
              />

              {imageFile && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Imagen seleccionada: <strong>{imageFile.name}</strong>
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderLeft: `4px solid #7B1FA2`,
              backgroundColor: alpha('#7B1FA2', 0.05),
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DescriptionIcon sx={{ color: '#7B1FA2', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#7B1FA2' }}>
                  Descripción del Caso
                </Typography>
              </Box>

              <TextField
                multiline
                minRows={5}
                fullWidth
                placeholder="Escribe una breve descripción de la desviación dental observada..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CardContent>

            <Box sx={{ p: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#7B1FA2',
                  '&:hover': {
                    backgroundColor: alpha('#7B1FA2', 0.9)
                  }
                }}
              >
                Guardar Registro
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
