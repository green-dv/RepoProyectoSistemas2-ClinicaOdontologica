import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import { Patient } from '@/domain/entities/Patient';

interface ClinicalReportData {
  success: boolean;
  message: string;
  data: {
    paciente: {
      id: number;
      nombres: string;
      apellidos: string;
      nombreCompleto: string;
      direccion: string;
      telefonodomicilio: string;
      telefonopersonal: string;
      lugarnacimiento: string;
      fechanacimiento: string;
      sexo: string;
      estadocivil: string;
      ocupacion: string;
      aseguradora: string;
    };
    historialClinico: {
      totalAntecedentes: number;
      antecedentes: Array<{
        id: number;
        fecha: string;
        embarazo: boolean;
        enfermedades: string[];
        atencionesmedicas: string[];
        medicaciones: string[];
        habitos: string[];
      }>;
    };
    metadatos: {
      fechaGeneracionReporte: string;
      tipoReporte: string;
    };
  };
}

interface UseClinicalReportPrintReturn {
  isGenerating: boolean;
  generatePDF: (patient: Patient) => Promise<jsPDF>;
  downloadPDF: (patient: Patient) => Promise<void>;
  printPDF: (patient: Patient) => Promise<void>;
}

export const useClinicalReportPrint = (): UseClinicalReportPrintReturn => {
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchClinicalReport = async (patientId: number): Promise<ClinicalReportData> => {
    const response = await fetch(`/api/patients/${patientId}/report`);
    if (!response.ok) {
      throw new Error('Error al obtener el reporte clínico');
    }
    return response.json();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const addHeader = (doc: jsPDF, reportData: ClinicalReportData): number => {
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA CLÍNICA DEL PACIENTE', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    
    yPosition += 15;

    // Información del establecimiento (placeholder)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Centro Médico', 20, yPosition);
    doc.text(`Fecha de generación: ${formatDate(reportData.data.metadatos.fechaGeneracionReporte)}`, pageWidth - 20, yPosition, { align: 'right' });
    
    return yPosition + 10;
  };

  const addPatientInfo = (doc: jsPDF, reportData: ClinicalReportData, startY: number): number => {
    let yPosition = startY;
    const { paciente } = reportData.data;
    const leftColumn = 20;
    const rightColumn = doc.internal.pageSize.width / 2 + 10;

    // Título de sección
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL PACIENTE', leftColumn, yPosition);
    yPosition += 10;

    // Datos del paciente en dos columnas
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const patientData = [
      { label: 'Nombre Completo:', value: paciente.nombreCompleto },
      { label: 'Fecha de Nacimiento:', value: `${formatDate(paciente.fechanacimiento)} (${calculateAge(paciente.fechanacimiento)} años)` },
      { label: 'Sexo:', value: paciente.sexo },
      { label: 'Estado Civil:', value: paciente.estadocivil || 'No registrado' },
      { label: 'Lugar de Nacimiento:', value: paciente.lugarnacimiento || 'No registrado' },
      { label: 'Dirección:', value: paciente.direccion || 'No registrada' },
      { label: 'Teléfono Personal:', value: paciente.telefonopersonal || 'No registrado' },
      { label: 'Teléfono Domicilio:', value: paciente.telefonodomicilio || 'No registrado' },
      { label: 'Ocupación:', value: paciente.ocupacion || 'No registrada' },
      { label: 'Aseguradora:', value: paciente.aseguradora || 'No registrada' }
    ];

    patientData.forEach((item, index) => {
      const isLeftColumn = index % 2 === 0;
      const xPosition = isLeftColumn ? leftColumn : rightColumn;
      
      if (isLeftColumn) {
        yPosition += 6;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(item.label, xPosition, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(item.value, xPosition + 35, yPosition);
    });

    return yPosition + 20;
  };

  const addClinicalHistory = (doc: jsPDF, reportData: ClinicalReportData, startY: number): number => {
    let yPosition = startY;
    const { historialClinico } = reportData.data;
    const leftMargin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Título de sección
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIAL CLÍNICO', leftMargin, yPosition);
    yPosition += 10;

    if (historialClinico.totalAntecedentes === 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('No hay antecedentes médicos registrados.', leftMargin, yPosition);
      return yPosition + 10;
    }

    historialClinico.antecedentes.forEach((antecedente, index) => {
      // Verificar si necesitamos una nueva página
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Título del antecedente
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Antecedente #${antecedente.id} - ${formatDate(antecedente.fecha)}`, leftMargin, yPosition);
      yPosition += 8;

      // Estado de embarazo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Embarazo: ${antecedente.embarazo ? 'Sí' : 'No'}`, leftMargin + 5, yPosition);
      yPosition += 8;

      // Enfermedades
      if (antecedente.enfermedades.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Enfermedades:', leftMargin + 5, yPosition);
        yPosition += 5;
        
        antecedente.enfermedades.forEach((enfermedad) => {
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${enfermedad}`, leftMargin + 10, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      }

      // Atenciones médicas
      if (antecedente.atencionesmedicas.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Atenciones Médicas:', leftMargin + 5, yPosition);
        yPosition += 5;
        
        antecedente.atencionesmedicas.forEach((atencion) => {
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${atencion}`, leftMargin + 10, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      }

      // Medicaciones
      if (antecedente.medicaciones.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Medicaciones:', leftMargin + 5, yPosition);
        yPosition += 5;
        
        antecedente.medicaciones.forEach((medicacion) => {
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${medicacion}`, leftMargin + 10, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      }

      // Hábitos
      if (antecedente.habitos.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Hábitos:', leftMargin + 5, yPosition);
        yPosition += 5;
        
        antecedente.habitos.forEach((habito) => {
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${habito}`, leftMargin + 10, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      }

      // Separador entre antecedentes
      if (index < historialClinico.antecedentes.length - 1) {
        doc.setLineWidth(0.2);
        doc.line(leftMargin, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
      }
    });

    return yPosition;
  };

  const addFooter = (doc: jsPDF): void => {
    const pageCount = doc.internal.pages.length - 1;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  };

  const generatePDF = useCallback(async (patient: Patient): Promise<jsPDF> => {
    if (!patient.idpaciente) {
      throw new Error('ID del paciente no disponible');
    }

    setIsGenerating(true);
    
    try {
      const reportData = await fetchClinicalReport(patient.idpaciente);
      
      const doc = new jsPDF();
      
      // Agregar contenido
      let yPosition = addHeader(doc, reportData);
      yPosition = addPatientInfo(doc, reportData, yPosition);
      addClinicalHistory(doc, reportData, yPosition);
      
      // Agregar pie de página
      addFooter(doc);
      
      return doc;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadPDF = useCallback(async (patient: Patient): Promise<void> => {
    try {
      const doc = await generatePDF(patient);
      const fileName = `ficha_clinica_${patient.nombres}_${patient.apellidos}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw error;
    }
  }, [generatePDF]);

  const printPDF = useCallback(async (patient: Patient): Promise<void> => {
    try {
      const doc = await generatePDF(patient);
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          URL.revokeObjectURL(pdfUrl);
        };
      }
    } catch (error) {
      console.error('Error al imprimir PDF:', error);
      throw error;
    }
  }, [generatePDF]);

  return {
    isGenerating,
    generatePDF,
    downloadPDF,
    printPDF
  };
};