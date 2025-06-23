'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useExpectedVsPaidChart } from '@/presentation/handlers/useExpectedPaidChartHandler';


interface ExpectedVsPaidChartProps {
    height?: number;
}

export const ExpectedVsPaidChart: React.FC<ExpectedVsPaidChartProps> = ({ 
    height = 400 
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const { data, loading } = useExpectedVsPaidChart();

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

        const expectedSeries = chart.addSeries(LineSeries, {
            color: '#FF6B6B',
            lineWidth: 3,
        });

        const paidSeries = chart.addSeries(LineSeries, {
            color: '#4ECDC4',
            lineWidth: 3,
        });

        const expectedData = data.map((d) => ({
            time: d.month + "-01",
            value: d.esperado,
        }));

        const paidData = data.map((d) => ({
            time: d.month + "-01", 
            value: d.pagado,
        }));

        console.log('daaaata:', expectedData);
        console.log('dataaapaid:', paidData);

        expectedSeries.setData(expectedData);
        paidSeries.setData(paidData);
        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    }, [data, loading, height]);

    if (loading) {
        return (
        <Paper sx={{ p: 3, height }}>
            <Typography variant="h6" gutterBottom>
            Esperado vs Pagado
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
            Esperado vs Pagado
            </Typography>
            <Alert severity="info">No hay datos disponibles</Alert>
        </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, height }}>
        <Typography variant="h6" gutterBottom>
            Esperado vs Pagado
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