import { useEffect } from 'react';
import useRadiographies from '../hooks/useRadiographies';
import { Radiography, Detection } from '@/domain/entities/Radiography';

export default function useRadiographiesHandlers(){
  const{
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
  } = useRadiographies();

  //FETCH
  const handleFetchByRadiographyId = async(
    idradiografia: number,
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/radiography/getOne`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idradiografia }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Error al obtener la radiografía');
      }

      const data: Radiography = await response.json();
      setNewRadiography(data);
      setPreviewUrl(data.enlaceradiografia);
      showMessage('Radiografía cargada correctamente', 'success');
    } catch (error) {
      console.error('Error al obtener radiografía:', error);
      showMessage('No se pudo obtener la radiografía', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const handleFetchAllRadiographies = async() => {
    if(isCreating) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/radiography`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Error al obtener la radiografía');
      }

      const data: Radiography[] = await response.json();
      setRadiographies(data);
      showMessage('Radiografía cargada correctamente', 'success');
    } catch (error) {
      console.error('Error al obtener radiografía:', error);
      showMessage('No se pudo obtener la radiografía', 'error');
    } finally {
      setIsLoading(false);
    }
  }


  const handleFetchByPatientId= async(
    idpaciente: number | null
  ) => {
    try {
      if(isCreating) return;
      setIsLoading(true);
      const response = await fetch(`/api/radiography/patient`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idpaciente }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Error al obtener las radiografías');
      }

      const data: Radiography[] = await response.json();
      setRadiographies(data);
      showMessage('Radiografía cargada correctamente', 'success');
    } catch (error) {
      console.error('Error al obtener radiografías:', error);
      showMessage('No se pudo obtener las radiografías', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  //SUBIR IMAGEN

  const handleSaveRadiography = async () => {
    if (!selectedFile && !previewUrl) return;

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      if (selectedFile) {
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + Math.random() * 15, 95));
        }, 500);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append(
          'pinataMetadata',
          JSON.stringify({
            name: `radiografia-${patientId}-${Date.now()}`,
            keyvalues: { tipo: 'radiografia', paciente: patientId.toString() }
          })
        );
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

        const resp = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(96);

        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.error ?? 'Error al subir imagen a Pinata');
        }

        const { IpfsHash } = await resp.json();
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;

        // Guardamos en el estado
        setPreviewUrl(gatewayUrl);
        console.log(gatewayUrl);
        setUploadProgress(100);
        showMessage('Radiografía subida correctamente', 'success');
      } else if (!selectedFile && previewUrl) {
        // Si se desea eliminar la imagen
        setPreviewUrl(null);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Error desconocido');
      showMessage('Ocurrió un error al subir la radiografía', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };


  useEffect(() => {
    if(!detections) return;
    if (!canvasRef.current || !previewUrl || detections.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Dibujar detecciones
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.font = '16px Arial';
      ctx.fillStyle = 'red';

      detections.forEach((det) => {
        const { x1, y1, x2, y2, problema } = det;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.fillText(`${problema}`, x1 + 4, y1 + 18);
      });
    };

    img.src = previewUrl; // o imageUrl si lo estás usando
  }, [detections]);

  const handleSnackbarClose = () => {
    setSnackbar(null);
  };



//***************************************** 
//***************************************** 
  const handleCreateRadiography = async () => {
    if (!isCreating || !newRadiography || !previewUrl) return;

    try {
      setError('');
      const postRadiography: Radiography ={
        idradiografia: 0,
        idpaciente: patientId,
        enlaceradiografia: previewUrl?? '',
        detecciones: detections,
        paciente: '',
        fechasubida: new Date()
      };
      console.log('Radiografia a subir');
      console.log(postRadiography)
      const response = await fetch('/api/radiography', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postRadiography),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Error al crear la radiografía');
      }

      const created = await response.json();
      setRadiographies(prev => [...prev, created]);
      showMessage('Radiografía creada correctamente', 'success');
      setSelectedFile(null);
      setDrawImage(null);
      setNewRadiography({
        idradiografia: 0,
        idpaciente: 0,
        detecciones: [],
        paciente: '',
        fechasubida: new Date(),
        enlaceradiografia: ''
      });
      setDetections(null);

    } catch (error) {
      console.error('Error al crear radiografía:', error);
      showMessage('No se pudo crear la radiografía', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUploadAndPredict = async () => {
    if (!selectedFile) {
      showMessage('Selecciona un archivo para analizar', 'warning');
      return;
    }

    try {
      console.log('se entro a la prediccion');
      setIsUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', selectedFile);
//'https://oreppluscnn.onrender.com/predict/'
      const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al procesar la imagen');
      }

      const detections = await response.json();
      console.log(detections);
      const newDetections: Detection[] = detections.map((detection: any, index: number) => ({
        iddeteccion: index, // puedes usar un ID temporal o autoincremental
        idproblema: detection.class,
        x1: detection.box.x1,
        x2: detection.box.x2,
        y1: detection.box.y1,
        y2: detection.box.y2,
        confianza: detection.confidence,
        idradiografia: 0, // lo puedes actualizar luego con el ID real
        problema: detection.name,
      }));
      setDetections(newDetections);
      showMessage('Análisis completado', 'success');
    } catch (error) {
      console.error('Error al predecir detecciones:', error);
      showMessage('Error al analizar la imagen', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };


  const handleConfiguration = (p_patientID: number | null, creating: boolean, p_radiographyId: number | null, ) =>{
    setPatientId(p_patientID ?? 0);
    setIsCreating(creating);
    if(creating){
      return;
    }
    if(p_radiographyId){
      handleFetchByRadiographyId(p_radiographyId);
      return;
    }
    if(p_patientID){
      handleFetchByPatientId(p_patientID);
      return;
    }
    handleFetchAllRadiographies();
  }

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setSelectedFile(file);
    setDrawImage(file);
    setDetections(null);
  };





  return{
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


    handleFetchByRadiographyId,
    handleFetchAllRadiographies,
    handleFetchByPatientId,
    handleSaveRadiography,
    handleCreateRadiography,
    handleUploadAndPredict,
    handleConfiguration,
    handlePreviewImageChange,

    handleSnackbarClose
  };
}