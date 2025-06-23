import { Metadata } from 'next';
import DebtReportsComponent from '@/components/reports/DebtsPatient';

export const metadata: Metadata = {
  title: 'Reporte de Deudas',
  description: 'Generar reportes de deudas por paciente',
};

export default function ReporteCitasPage() {
  return <DebtReportsComponent />;
}