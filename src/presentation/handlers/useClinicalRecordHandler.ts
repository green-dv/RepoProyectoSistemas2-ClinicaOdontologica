import { useCallback } from 'react';
import { Patient } from '@/domain/entities/Patient';
import { useClinicalReportPrint } from '@/presentation/hooks/useClinicalRecordPrint';

interface UseClinicalPrintHandlersProps {
  patient: Patient | null;
  onPrintSuccess?: () => void;
  onPrintError?: (error: Error) => void;
}

interface ClinicalPrintHandlers {
  handleDownloadPDF: () => Promise<void>;
  handlePrintPDF: () => Promise<void>;
  handlePreviewPDF: () => Promise<void>;
  isGenerating: boolean;
}

export const useClinicalPrintHandlers = ({
  patient,
  onPrintSuccess,
  onPrintError
}: UseClinicalPrintHandlersProps): ClinicalPrintHandlers => {
  const { isGenerating, generatePDF, downloadPDF, printPDF } = useClinicalReportPrint();

  const handleDownloadPDF = useCallback(async (): Promise<void> => {
    if (!patient) {
      const error = new Error('No hay paciente seleccionado');
      onPrintError?.(error);
      return;
    }

    try {
      await downloadPDF(patient);
      onPrintSuccess?.();
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      onPrintError?.(error as Error);
    }
  }, [patient, downloadPDF, onPrintSuccess, onPrintError]);

  const handlePrintPDF = useCallback(async (): Promise<void> => {
    if (!patient) {
      const error = new Error('No hay paciente seleccionado');
      onPrintError?.(error);
      return;
    }

    try {
      await printPDF(patient);
      onPrintSuccess?.();
    } catch (error) {
      console.error('Error al imprimir PDF:', error);
      onPrintError?.(error as Error);
    }
  }, [patient, printPDF, onPrintSuccess, onPrintError]);

  const handlePreviewPDF = useCallback(async (): Promise<void> => {
    if (!patient) {
      const error = new Error('No hay paciente seleccionado');
      onPrintError?.(error);
      return;
    }

    try {
      const doc = await generatePDF(patient);
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Abrir en nueva ventana para previsualización
      const previewWindow = window.open(pdfUrl, '_blank');
      if (!previewWindow) {
        throw new Error('No se pudo abrir la ventana de previsualización. Verifique que los pop-ups estén habilitados.');
      }
      
      // Limpiar URL después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
      
      onPrintSuccess?.();
    } catch (error) {
      console.error('Error al previsualizar PDF:', error);
      onPrintError?.(error as Error);
    }
  }, [patient, generatePDF, onPrintSuccess, onPrintError]);

  return {
    handleDownloadPDF,
    handlePrintPDF,
    handlePreviewPDF,
    isGenerating
  };
};