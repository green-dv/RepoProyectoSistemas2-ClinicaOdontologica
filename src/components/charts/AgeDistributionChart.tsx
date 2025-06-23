import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, HistogramSeries } from 'lightweight-charts';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useAgeDistributionChart } from '@/presentation/handlers/useAgeDistributionChartHandler';

interface AgeDistributionChartProps {
    height?: number;
}

export const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({ 
    height = 400 
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const { data, loading } = useAgeDistributionChart();

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
                timeVisible: false,
                ticksVisible: false,
            },
        });

        const histogramSeries = chart.addSeries(HistogramSeries, {
            color: '#9C27B0',
        });

        const baseDate = new Date(2022, 0, 1); 
        const formattedData = data.map((d, index) => {
            const date = new Date(baseDate);
            date.setDate(baseDate.getDate() + index);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return {
                time: `${yyyy}-${mm}-${dd}`,
                value: d.total,
                color: `hsl(${(index * 360) / data.length}, 70%, 60%)`,
            };
        });

        console.log('Setting data for AgeDistribution:', formattedData);
        console.log('Original age data:', data);

        histogramSeries.setData(formattedData);
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
            Distribución por Edad
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
            Distribución por Edad
            </Typography>
            <Alert severity="info">No hay datos disponibles</Alert>
        </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, height }}>
        <Typography variant="h6" gutterBottom>
            Distribución por Edad
        </Typography>
        <Box 
            ref={chartContainerRef} 
            sx={{ 
            width: '100%',
            height: height - 80,
            }} 
        />
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {data.map((item, index) => (
            <Box 
                key={item.rangoEdad}
                sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                fontSize: '0.875rem'
                }}
            >
                <Box 
                sx={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: `hsl(${(index * 360) / data.length}, 70%, 60%)`,
                    borderRadius: '2px'
                }} 
                />
                <Typography variant="body2">
                {item.rangoEdad}: {item.total}
                </Typography>
            </Box>
            ))}
        </Box>
        </Paper>
    );
};