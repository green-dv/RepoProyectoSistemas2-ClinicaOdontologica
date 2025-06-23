import { Metadata } from 'next';
import ReporteCitas from '@/components/reports/DatesResports';

export const metadata: Metadata = {
  title: 'Reporte de Citas',
  description: 'Generar reportes de citas por rango de fechas',
};

export default function ReporteCitasPage() {
  return <ReporteCitas />;
}