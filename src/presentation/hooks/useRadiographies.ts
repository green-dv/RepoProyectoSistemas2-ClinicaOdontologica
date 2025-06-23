import { useRef, useState } from 'react';
import { Radiography, Detection } from '@/domain/entities/Radiography';
import { AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

export interface RadiographiesState {
  radiographies: Radiography[];
  newRadiography: Radiography;

  patientId: number;
  selectedFile: File | null;
  drawImage: File | null;
  detections: Detection[] | null;

  error: string;
  previewUrl: string | null;
  uploadProgress: number;

  isCreating: boolean;
  isLoading: boolean;
  isUploading: boolean;

  snackbar: SnackbarMessage | null;

  canvasRef: React.RefObject<HTMLCanvasElement>;
  // Setters
  setRadiographies: React.Dispatch<React.SetStateAction<Radiography[]>>;
  setNewRadiography: React.Dispatch<React.SetStateAction<Radiography>>;
  setPatientId: React.Dispatch<React.SetStateAction<number>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setDrawImage: React.Dispatch<React.SetStateAction<File | null>>;
  setDetections: React.Dispatch<React.SetStateAction<Detection[] | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarMessage | null>>;
  
  showMessage: (message: string, severity: AlertColor) => void;
}

export default function useRadiographies(): RadiographiesState {
  const [radiographies, setRadiographies] = useState<Radiography[]>([]);
  const [newRadiography, setNewRadiography] = useState<Radiography>({
    idradiografia: 0,
    enlaceradiografia: '',
    fechasubida: new Date(),
    idpaciente: 0,
    paciente: '',
    detecciones: []
  });

  const [patientId, setPatientId] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detections, setDetections] = useState<Detection[] | null>(null);

  const [error, setError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [drawImage, setDrawImage] = useState<File | null>(null);

  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showMessage = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
  };

  return {
    radiographies, setRadiographies,
    newRadiography, setNewRadiography,
    patientId, setPatientId,
    selectedFile, setSelectedFile,
    detections, setDetections,
    error, setError,
    previewUrl, setPreviewUrl,
    uploadProgress, setUploadProgress,
    isCreating, setIsCreating,
    isLoading, setIsLoading,
    isUploading, setIsUploading,
    snackbar, setSnackbar,
    drawImage, setDrawImage,
    showMessage,
    canvasRef,
  };
}