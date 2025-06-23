import jsPDF from 'jspdf';
import { Cita } from '@/domain/entities/reports/datesReports';

export interface ReporteCitasHandlers {
  handleBuscarCitas: () => Promise<void>;
  handleExportarPDF: () => void;
  handleLimpiarFiltros: () => void;
}

interface CreateHandlersParams {
  fechaInicio: Date | null;
  fechaFin: Date | null;
  citas: Cita[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCitas: (citas: Cita[]) => void;
  setFechaInicio: (fecha: Date | null) => void;
  setFechaFin: (fecha: Date | null) => void;
}

export const createReporteCitasHandlers = ({
  fechaInicio,
  fechaFin,
  citas,
  setLoading,
  setError,
  setCitas,
  setFechaInicio,
  setFechaFin,
}: CreateHandlersParams): ReporteCitasHandlers => {
  
  const handleBuscarCitas = async (): Promise<void> => {
    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona ambas fechas');
      return;
    }

    if (fechaInicio > fechaFin) {
      setError('La fecha de inicio no puede ser mayor a la fecha fin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
      const fechaFinStr = fechaFin.toISOString().split('T')[0];

      const response = await fetch(
        `/api/reports/dates?fecha_inicio=${fechaInicioStr}&fecha_fin=${fechaFinStr}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener las citas');
      }

      const data: Cita[] = await response.json();
      setCitas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleExportarPDF = (): void => {
    if (citas.length === 0) {
      setError('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Citas', 14, 22);
    
    // Información del rango de fechas
    doc.setFontSize(12);
    const fechaInicioStr = fechaInicio?.toLocaleDateString('es-ES') || '';
    const fechaFinStr = fechaFin?.toLocaleDateString('es-ES') || '';
    doc.text(`Período: ${fechaInicioStr} - ${fechaFinStr}`, 14, 32);
    doc.text(`Total de citas: ${citas.length}`, 14, 40);

    // Configuración inicial de la tabla manual
    const startY = 50;
    const lineHeight = 8;
    const colWidths = [30, 40, 40, 25, 55]; // Ancho de columnas
    const pageWidth = doc.internal.pageSize.width;
    const marginLeft = 14;
    
    // Headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha', marginLeft, startY);
    doc.text('Nombres', marginLeft + colWidths[0], startY);
    doc.text('Apellidos', marginLeft + colWidths[0] + colWidths[1], startY);
    doc.text('Estado', marginLeft + colWidths[0] + colWidths[1] + colWidths[2], startY);
    doc.text('Descripción', marginLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], startY);
    
    // Línea debajo de headers
    doc.line(marginLeft, startY + 2, pageWidth - 14, startY + 2);
    
    // Datos
    doc.setFont('helvetica', 'normal');
    let currentY = startY + 10;
    
    citas.forEach((cita, index) => {
      // Verificar si necesitamos nueva página
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
        
        // Repetir headers en nueva página
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha', marginLeft, currentY);
        doc.text('Nombres', marginLeft + colWidths[0], currentY);
        doc.text('Apellidos', marginLeft + colWidths[0] + colWidths[1], currentY);
        doc.text('Estado', marginLeft + colWidths[0] + colWidths[1] + colWidths[2], currentY);
        doc.text('Descripción', marginLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY);
        doc.line(marginLeft, currentY + 2, pageWidth - 14, currentY + 2);
        currentY += 10;
        doc.setFont('helvetica', 'normal');
      }
      
      // Truncar texto si es muy largo
      const truncateText = (text: string, maxWidth: number): string => {
        const textWidth = doc.getTextWidth(text);
        if (textWidth <= maxWidth) return text;
        
        let truncated = text;
        while (doc.getTextWidth(truncated + '...') > maxWidth && truncated.length > 0) {
          truncated = truncated.slice(0, -1);
        }
        return truncated + '...';
      };
      
      const fecha = new Date(cita.fecha).toLocaleDateString('es-ES');
      const nombres = truncateText(cita.nombres, colWidths[1] - 2);
      const apellidos = truncateText(cita.apellidos, colWidths[2] - 2);
      const estado = truncateText(cita.estado, colWidths[3] - 2);
      const descripcion = truncateText(cita.descripcion, colWidths[4] - 2);
      
      doc.text(fecha, marginLeft, currentY);
      doc.text(nombres, marginLeft + colWidths[0], currentY);
      doc.text(apellidos, marginLeft + colWidths[0] + colWidths[1], currentY);
      doc.text(estado, marginLeft + colWidths[0] + colWidths[1] + colWidths[2], currentY);
      doc.text(descripcion, marginLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY);
      
      currentY += lineHeight;
    });

    // Guardar el PDF
    const fileName = `reporte_citas_${fechaInicioStr.replace(/\//g, '-')}_${fechaFinStr.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  };

  const handleLimpiarFiltros = (): void => {
    setFechaInicio(null);
    setFechaFin(null);
    setCitas([]);
    setError(null);
  };

  return {
    handleBuscarCitas,
    handleExportarPDF,
    handleLimpiarFiltros,
  };
};