import jsPDF from "jspdf";

interface PDFExportOptions {
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter' | 'a3';
  margin?: number;
  width?: number;
  quality?: number;
  fileName?: string;
}

export const exportToPDF = async (
  elementId: string, 
  fileName: string = 'reporte',
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    orientation = 'landscape',
    format = 'a4',
    margin = 10,
    width = 800,
    quality = 1.0
  } = options;

  const pdf = new jsPDF({
    orientation,
    unit: "pt",
    format,
    compress: true,
    precision: 2
  });

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Elemento con ID '${elementId}' no encontrado.`);
  }

  try {
    const htmlOptions = {
      callback: function(doc: jsPDF) {
        doc.setProperties({
          title: fileName,
          subject: 'Reporte de Pagos por Paciente',
          author: 'Sistema de Gestión Médica',
          creator: 'Sistema de Reportes',
          keywords: 'reporte, pagos, paciente, medical'
        });
        
        doc.save(`${fileName}.pdf`);
      },
      x: margin,
      y: margin,
      width: width,
      windowWidth: element.scrollWidth || 1200,
      autoPaging: 'text',
      html2canvas: {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true,
        removeContainer: true
      },
      jsPDF: {
        unit: 'pt',
        format: format,
        orientation: orientation
      }
    };

    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    const originalTop = element.style.top;

    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.position = 'static';
    element.style.left = 'auto';
    element.style.top = 'auto';

    // solucionar problemas del htmlOptions
    await pdf.html(element, htmlOptions);

    element.style.display = originalDisplay;
    element.style.visibility = originalVisibility;
    element.style.position = originalPosition;
    element.style.left = originalLeft;
    element.style.top = originalTop;

  } catch (error) {
    console.error("Error al exportar PDF:", error);
    throw new Error(`Error al generar el PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

export const exportPaymentReportToPDF = async (
  patientName: string,
  patientId: number
): Promise<void> => {
  const fileName = `Reporte_Pagos_${patientName.replace(/\s+/g, '_')}_${patientId}`;
  
  const options: PDFExportOptions = {
    orientation: 'landscape',
    format: 'a4',
    margin: 15,
    width: 780,
    quality: 1.2,
    fileName
  };

  await exportToPDF('pdf-report-content', fileName, options);
};

export const canExportToPDF = (elementId: string): boolean => {
  const element = document.getElementById(elementId);
  return element !== null && element.children.length > 0;
};

export const preparePDFElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete) {
      img.loading = 'eager';
    }
  });

  const collapsibleElements = element.querySelectorAll('[data-collapse="true"]');
  collapsibleElements.forEach(el => {
    (el as HTMLElement).style.display = 'block';
  });
};

export interface PDFExportStatus {
  isExporting: boolean;
  progress?: number;
  error?: string;
}
import React from 'react';
export const usePDFExport = () => {
  const [status, setStatus] = React.useState<PDFExportStatus>({
    isExporting: false
  });

  const exportPDF = async (
    elementId: string,
    fileName: string,
    options?: PDFExportOptions
  ) => {
    setStatus({ isExporting: true });
    
    try {
      // Preparar elemento
      preparePDFElement(elementId);
      
      // Validar que el elemento existe
      if (!canExportToPDF(elementId)) {
        throw new Error('No hay contenido disponible para exportar');
      }

      // Exportar
      await exportToPDF(elementId, fileName, options);
      
      setStatus({ isExporting: false });
    } catch (error) {
      setStatus({
        isExporting: false,
        error: error instanceof Error ? error.message : 'Error al exportar PDF'
      });
      throw error;
    }
  };

  const clearError = () => {
    setStatus(prev => ({ ...prev, error: undefined }));
  };

  return {
    status,
    exportPDF,
    clearError,
    isExporting: status.isExporting,
    error: status.error
  };
};

export default exportToPDF;