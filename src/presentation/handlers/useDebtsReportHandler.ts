import jsPDF from 'jspdf';
import { debtsByPatient } from '@/domain/entities/reports/debtsByPatient';
import { Patient } from '@/domain/entities/Patient';

export class DebtReportsHandlers {
    static groupDebtsByPatient(debts: debtsByPatient[]): debtsByPatient[] {
        if (!Array.isArray(debts) || debts.length === 0) {
            return [];
        }

        const groupedMap = debts.reduce((acc, debt) => {
            if (!debt || typeof debt.idpaciente !== 'number') {
                console.warn('Debt object invalid:', debt);
                return acc;
            }

            const key = debt.idpaciente;
            
            if (!acc[key]) {
                acc[key] = {
                    idpaciente: debt.idpaciente,
                    nombres: debt.nombres || '',
                    apellidos: debt.apellidos || '',
                    total_esperado: 0,
                    total_pagado: 0,
                    deuda: 0,
                };
            }
            
            const safeParseFloat = (value: number | string | undefined): number => {
                if (typeof value === 'number') return isNaN(value) ? 0 : value;
                if (typeof value === 'string') {
                    const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
                    return isNaN(parsed) ? 0 : parsed;
                }
                return 0;
            };
            
            const totalEsperado = safeParseFloat(debt.total_esperado);
            const totalPagado = safeParseFloat(debt.total_pagado);
            const deuda = safeParseFloat(debt.deuda);
            
            acc[key].total_esperado = (typeof acc[key].total_esperado === 'number' ? acc[key].total_esperado : 0) + totalEsperado;
            acc[key].total_pagado = (typeof acc[key].total_pagado === 'number' ? acc[key].total_pagado : 0) + totalPagado;
            acc[key].deuda = (typeof acc[key].deuda === 'number' ? acc[key].deuda : 0) + deuda;
            
            return acc;
        }, {} as Record<number, debtsByPatient>);

        return Object.values(groupedMap).sort((a, b) => {
            const deudaA = typeof a.deuda === 'number' ? a.deuda : 0;
            const deudaB = typeof b.deuda === 'number' ? b.deuda : 0;
            return deudaB - deudaA;
        });
    }

    static handlePatientSelect(
        patient: Patient,
        setSelectedPatient: (patient: Patient) => void,
        setSearchQuery: (query: string) => void,
        fetchDebtReport: (patientId: number | null) => Promise<void>
    ): void {
        if (!patient) {
            console.warn('Patient is null or undefined');
            return;
        }

        setSelectedPatient(patient);
        setSearchQuery(`${patient.nombres} ${patient.apellidos}`);
        
        if (patient.idpaciente) {
            fetchDebtReport(patient.idpaciente);
        } else {
            console.warn('Patient has no valid idpaciente');
        }
    }

    static handleClearPatient(
        clearPatientSearch: () => void,
        fetchDebtReport: (patientId: number | null) => Promise<void>
    ): void {
        clearPatientSearch();
        fetchDebtReport(null);
    }

    static handleGenerateReport(
        fetchDebtReport: (patientId: number | null) => Promise<void>
    ): void {
        fetchDebtReport(null);
    }

    static handleExportToPDF(debts: debtsByPatient[], selectedPatient: Patient | null): boolean {
        try {
            if (!Array.isArray(debts) || debts.length === 0) {
                throw new Error('No hay datos para exportar');
            }

            const doc = new jsPDF();
            
            doc.setFont('helvetica');
            
            const title = selectedPatient 
                ? `Reporte de Deudas - ${selectedPatient.nombres} ${selectedPatient.apellidos}`
                : 'Reporte General de Deudas de Pacientes';
            
            // Título principal
            doc.setFontSize(16);
            doc.setTextColor(40, 40, 40);
            doc.text(title, 14, 20);
            
            const currentDate = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Fecha: ${currentDate}`, 14, 30);

            const totals = this.calculateTotals(debts);

            doc.setFontSize(12);
            doc.setTextColor(40, 40, 40);
            doc.text('Resumen:', 14, 45);
            
            doc.setFontSize(10);
            doc.text(`Total Esperado: ${this.formatCurrency(totals.totalEsperado)}`, 14, 55);
            doc.text(`Total Pagado: ${this.formatCurrency(totals.totalPagado)}`, 14, 62);
            doc.text(`Total Deuda: ${this.formatCurrency(totals.totalDeuda)}`, 14, 69);
            doc.text(`Cantidad de Pacientes: ${totals.cantidadPacientes}`, 14, 76);

            const startY = 90;
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 14;
            const tableWidth = pageWidth - (margin * 2);
            
            const columns = [
                { header: 'ID', width: 20 },
                { header: 'Nombres', width: 50 },
                { header: 'Apellidos', width: 50 },
                { header: 'Total Esperado', width: 35 },
                { header: 'Total Pagado', width: 35 },
                { header: 'Deuda', width: 35 }
            ];

            let currentY = startY;
            
            const drawTableHeader = (y: number) => {
                // Fondo del encabezado
                doc.setFillColor(63, 81, 181);
                doc.rect(margin, y - 8, tableWidth, 12, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                
                let x = margin + 2;
                columns.forEach(col => {
                    doc.text(col.header, x, y - 2);
                    x += col.width;
                });
                
                return y + 4;
            };

            const drawTableRow = (debt: debtsByPatient, y: number, isEven: boolean) => {
                const safeNumber = (value: number | string): number => {
                    if (typeof value === 'number') return isNaN(value) ? 0 : value;
                    if (typeof value === 'string') {
                        const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
                        return isNaN(parsed) ? 0 : parsed;
                    }
                    return 0;
                };

                if (isEven) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(margin, y - 8, tableWidth, 12, 'F');
                }

                // Texto de la fila
                doc.setTextColor(40, 40, 40);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                
                const rowData = [
                    (debt.idpaciente || 0).toString(),
                    debt.nombres || 'N/A',
                    debt.apellidos || 'N/A',
                    this.formatCurrency(safeNumber(debt.total_esperado)),
                    this.formatCurrency(safeNumber(debt.total_pagado)),
                    this.formatCurrency(safeNumber(debt.deuda))
                ];

                let x = margin + 2;
                rowData.forEach((data, index) => {
                    const col = columns[index];
                    
                    if (index >= 3) {
                        const textWidth = doc.getTextWidth(data);
                        doc.text(data, x + col.width - textWidth - 2, y - 2);
                    } else {
                        const maxWidth = col.width - 4;
                        let text = data;
                        while (doc.getTextWidth(text) > maxWidth && text.length > 0) {
                            text = text.substring(0, text.length - 1);
                        }
                        if (text !== data && text.length > 0) {
                            text = text.substring(0, text.length - 3) + '...';
                        }
                        doc.text(text, x, y - 2);
                    }
                    
                    x += col.width;
                });

                return y + 12;
            };

            const addFooter = (pageNumber: number) => {
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(
                    `Página ${pageNumber} - Generado el ${currentDate}`,
                    margin,
                    pageHeight - 10
                );
            };

            // Dibujar encabezado de tabla
            currentY = drawTableHeader(currentY);
            
            let pageNumber = 1;
            let rowCount = 0;

            // Dibujar filas de datos
            debts.forEach((debt, index) => {
                if (currentY > pageHeight - 30) {
                    addFooter(pageNumber);
                    doc.addPage();
                    pageNumber++;
                    currentY = 20;
                    currentY = drawTableHeader(currentY);
                }

                currentY = drawTableRow(debt, currentY, index % 2 === 0);
                rowCount++;
            });

            // Agregar línea de totales al final
            if (currentY > pageHeight - 50) {
                addFooter(pageNumber);
                doc.addPage();
                pageNumber++;
                currentY = 20;
            }

            currentY += 5;
            doc.setDrawColor(63, 81, 181);
            doc.setLineWidth(0.5);
            doc.line(margin, currentY, pageWidth - margin, currentY);
            currentY += 10;

            // Totales finales
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40, 40, 40);
            
            const totalTexts = [
                `TOTAL ESPERADO: ${this.formatCurrency(totals.totalEsperado)}`,
                `TOTAL PAGADO: ${this.formatCurrency(totals.totalPagado)}`,
                `TOTAL DEUDA: ${this.formatCurrency(totals.totalDeuda)}`
            ];

            totalTexts.forEach((text, index) => {
                doc.text(text, pageWidth - margin - doc.getTextWidth(text), currentY + (index * 7));
            });

            // Pie de página final
            addFooter(pageNumber);

            // Generar nombre del archivo
            const fileName = selectedPatient 
                ? `deudas_${selectedPatient.nombres}_${selectedPatient.apellidos}_${new Date().toISOString().split('T')[0]}.pdf`
                : `reporte_deudas_general_${new Date().toISOString().split('T')[0]}.pdf`;
            
            doc.save(fileName);
            
            return true;
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw new Error(`Error al generar el archivo PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    static formatCurrency(amount: number): string {
        const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(safeAmount);
    }

    static calculateTotals(debts: debtsByPatient[]): {
        totalEsperado: number;
        totalPagado: number;
        totalDeuda: number;
        cantidadPacientes: number;
    } {
        if (!Array.isArray(debts) || debts.length === 0) {
            return {
                totalEsperado: 0,
                totalPagado: 0,
                totalDeuda: 0,
                cantidadPacientes: 0,
            };
        }

        const safeNumber = (value: number | string): number => {
            if (typeof value === 'number') return isNaN(value) ? 0 : value;
            if (typeof value === 'string') {
                const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
                return isNaN(parsed) ? 0 : parsed;
            }
            return 0;
        };

        return {
            totalEsperado: debts.reduce((sum, debt) => sum + safeNumber(debt.total_esperado), 0),
            totalPagado: debts.reduce((sum, debt) => sum + safeNumber(debt.total_pagado), 0),
            totalDeuda: debts.reduce((sum, debt) => sum + safeNumber(debt.deuda), 0),
            cantidadPacientes: debts.length,
        };
    }
}