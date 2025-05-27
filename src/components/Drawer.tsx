'use client';
import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/navigation';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import { signOut } from "next-auth/react";
import { animate, stagger } from 'animejs';
import { text } from 'stream/consumers';
import PaymentsIcon from '@mui/icons-material/Payments';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // Mantener position fixed y agregar overflow hidden solo al toolbar
  position: 'fixed',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const AnimationContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(80, 1fr)',
  gridTemplateRows: 'repeat(4, 1fr)',
  gap: '1px',
  alignItems: 'center',
  justifyItems: 'center',
  pointerEvents: 'none',
  zIndex: 1,
  padding: '4px',
});

const AnimationDot = styled('div')({
  width: '4px',
  height: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '50%',
  transform: 'scale(0)',
});

// Styled Toolbar para controlar el overflow de la animación
const StyledToolbar = styled(Toolbar)({
  position: 'relative',
  overflow: 'hidden',
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

interface MiniDrawerProps {
  children: React.ReactNode;
}

export default function MiniDrawer({ children }: MiniDrawerProps) {
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const dotsRef = React.useRef<HTMLDivElement>(null);

  const menuItems = [
    { text: 'Inicio', path: '/' },
    { text: 'Pacientes', path: '/patients' },
    { text: 'Citas', path: '/dates' },
    { text: 'Calendario', path: '/calendar' },
    { text: 'Tratamientos', path: '/treatments' },
    { text: 'Reportes', path: '/reports' },
    { text: 'Pagos', path: '/paymentsPlan' },
  ];

  const getRandomStartPosition = (): number => {
    return Math.floor(Math.random() * 320);
  };

  const animateGrid = React.useCallback(() => {
    if (!dotsRef.current) return;
    
    const dots = dotsRef.current.querySelectorAll('.animation-dot');
    
    animate(dots, {
      scale: [
        { to: [0, 1.75] },
        { to: 0 }
      ],
      boxShadow: [
        { to: '0 0 1rem 0 currentColor' },
        { to: '0 0 0rem 0 currentColor' }
      ],
      delay: stagger(80, { 
        grid: [80, 4], 
        from: getRandomStartPosition()
      }),
      onComplete: animateGrid
    });
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      animateGrid();
    }, 1000);

    return () => clearTimeout(timer);
  }, [animateGrid]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" }); 
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <StyledToolbar>
          <AnimationContainer ref={dotsRef}>
            {Array.from({ length: 320 }, (_, index) => (
              <AnimationDot key={index} className="animation-dot" />
            ))}
          </AnimationContainer>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Clinica Dental Orep Plus
          </Typography>
        </StyledToolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map(({ text, path }, index) =>  (
            <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => router.push(path)}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {
                    text === 'Inicio' ? <HomeIcon /> :
                    text === 'Pacientes' ? <PeopleAltIcon/> :
                    text === 'Citas' ? <AccessTimeIcon/> :
                    text === 'Calendario'? <CalendarMonthIcon/> :
                    text === 'Tratamientos' ? <LocalHospitalIcon/> :
                    text === 'Reportes' ? <BarChartOutlined/> :
                    text === 'Pagos' ? <PaymentsIcon/> :
                    <HomeIcon />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            
          ))}
          <Divider/>
            <ListItem key={"logout"} onClick={handleLogout}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  <LogoutIcon/>
                </ListItemIcon>
                <ListItemText
                  primary="Cerrar Sesión"
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
            </ListItemButton>
          </ListItem>
        </List>
        
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}