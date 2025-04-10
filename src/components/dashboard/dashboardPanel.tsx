"use client"
import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import Grid from '@mui/material/Grid';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import TreatmentsPage from "@/app/treatments/page"; 
import Salespage from "@/app/dashboard/page"; 
import RecipeReviewCard from "@/components/card/CardModel"; 
import RegisterPage from "@/app/auth/register/page"; 

import DatesPage from "@/app/dates/page"



// Definición de tipos para las props
interface DashboardLayoutBasicProps {
  window?: () => Window;
}

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'RegisterPage',
    title: 'RegisterPage',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'RecipeReviewCard',
    title: 'Card',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'TreatmentsPage',
    title: 'TreatmentsPage',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'DatesPage',
    title: 'Fechas',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'DatesButton',
    title: 'DatesButton',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'TreatmentsPage',
    title: 'TreatmentsPage',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'TreatmentsPage',
    title: 'TreatmentsPage',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}
export default function DashboardLayoutBasic(props: DashboardLayoutBasicProps) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  const demoWindow = window ? window() : undefined;

  // Función para renderizar el componente basado en la ruta activa
  const renderPage = () => {
    switch (router.pathname) {
        case '/dashboard':
          return <Salespage />;
        case '/RegisterPage':
          return <RegisterPage />;
        case '/RecipeReviewCard':
          return <RecipeReviewCard />
        case '/TreatmentsPage':
          return <TreatmentsPage/>
        case '/DatesPage':
              return <DatesPage/>
        default:
          return <Salespage />;
    }
  };


  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={1}>
            {/* Aquí es donde se renderiza el componente correspondiente */}
            {renderPage()}
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
