'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useMonthlyIncomeChart } from '@/presentation/handlers/useMonthlyChartHandler';

interface MonthlyIncomeChartProps {
    height?: number;
}

export const MonthlyIncomeChart: React.FC<MonthlyIncomeChartProps> = ({ 
  height = 400 
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const { data, loading } = useMonthlyIncomeChart();

    useEffect(() => {
        if (!chartContainerRef.current || loading || data.length === 0) return;

        chartContainerRef.current.innerHTML = '';

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#333',
            },
            width: chartContainerRef.current.clientWidth,
            height: height - 80,
            grid: {
                vertLines: { color: '#e1e1e1' },
                horzLines: { color: '#e1e1e1' },
            },
            rightPriceScale: {
                borderColor: '#cccccc',
            },
            timeScale: {
                borderColor: '#cccccc',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: '#2962FF',
            topColor: '#2962FF',
            bottomColor: 'rgba(41, 98, 255, 0.28)',
            lineWidth: 2,
        });

        const formattedData = data.map((d) => ({
            time: d.month + "-01",
            value: d.totalIngresado,
        }));

        console.log('Setting data for MonthlyIncome:', formattedData);
        areaSeries.setData(formattedData);
        chart.timeScale().fitContent();

        // Cleanup
        return () => {
            chart.remove();
        };
    }, [data, loading, height]);

    if (loading) {
        return (
        <Paper sx={{ p: 3, height }}>
            <Typography variant="h6" gutterBottom>
            Ingresos Mensuales
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" height="calc(100% - 40px)">
                <CircularProgress />
            </Box>
        </Paper>
        );
    }

    if (data.length === 0) {
        return (
        <Paper sx={{ p: 3, height }}>
            <Typography variant="h6" gutterBottom>
            Ingresos Mensuales
            </Typography>
            <Alert severity="info">No hay datos disponibles</Alert>
        </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, height }}>
        <Typography variant="h6" gutterBottom>
            Ingresos Mensuales
        </Typography>
        <Box 
            ref={chartContainerRef} 
            sx={{ 
            width: '100%',
            height: height - 80,
            }} 
        />
        </Paper>
    );
};