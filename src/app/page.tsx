'use client';
import useDates from '@/presentation/hooks/useDate';
import useDatesHandlers from '@/presentation/handlers/useDateHandler';
import { useEffect } from "react";

import NumberDatesPerStatusChart from "@/components/charts/DatesCharts";
import { Container, Grid, Typography, Box } from "@mui/material";
import { MonthlyIncomeChart } from '@/components/charts/MonthlyIncomeChart';
import { ExpectedVsPaidChart } from '@/components/charts/ExpectedPaidChart';
import { AgeDistributionChart } from '@/components/charts/AgeDistributionChart';

export default function Home() {
  const datesState = useDates();
  
  const {
    handleFetchDates,
  } = useDatesHandlers(datesState);

  const {
    dates,
    searchTerm,
  } = datesState;

  useEffect(() => {
    handleFetchDates(searchTerm);
    return () => handleFetchDates.cancel();
  }, [searchTerm, handleFetchDates]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <NumberDatesPerStatusChart dates={dates} />
        </Grid>

        <Grid item xs={12} md={6}>
          <MonthlyIncomeChart />
        </Grid>

        <Grid item xs={12} lg={8}>
          <ExpectedVsPaidChart />
        </Grid>

        <Grid item xs={12} lg={4}>
      
          <Box sx={{ height: '300px' }}>
            <AgeDistributionChart />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}