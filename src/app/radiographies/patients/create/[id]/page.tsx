'use client';
import RadiographicsContent from '@/components/radiographies/RadiographiesForm';
import useRadiographiesHandlers from '@/presentation/handlers/useRadiographiesHandler';
import { useParams } from 'next/navigation';

export default function RadiographyPage() {

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


    handleFetchByRadiographyId,
    handleFetchAllRadiographies,
    handleFetchByPatientId,
    handleSaveRadiography,
    handleCreateRadiography,
    handleUploadAndPredict,
    handleConfiguration,

    handleSnackbarClose,
    handlePreviewImageChange
  } = useRadiographiesHandlers();

  const params = useParams();
  const id = Number(params.id);

  return (
    <div>
      <RadiographicsContent
      p_patientId={id}
      creating={true}
      p_radiographyId={null}

      newRadiography={newRadiography}
      detections={detections ?? []}
      selectedFile={selectedFile}
      error={error}
      previewUrl={previewUrl ?? ''}
      uploadProgress={uploadProgress}
      isUploading={isUploading}
      drawImage={drawImage}
      handleSaveRadiography={handleSaveRadiography}
      handleCreateRadiography={handleCreateRadiography}
      handleUploadAndPredict={handleUploadAndPredict}
      handleConfiguration={handleConfiguration}
      handlePreviewImageChange={handlePreviewImageChange}
      />
    </div>
  );
}