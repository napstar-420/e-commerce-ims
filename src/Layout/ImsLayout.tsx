import { ReactElement, useCallback, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
import { Avatar, Button, Menu, MenuItem, Stack, Theme } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '@emotion/react';
import { UserRoles } from '../dto';
import config from '../config';

const drawerWidth = 240;
const lgBreakpoint = 1200;

interface SidebarItem {
  title: string;
  Icon: () => ReactElement;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Home',
    Icon: () => <HomeIcon />,
    href: '/',
  },
  {
    title: 'Products',
    Icon: () => <InventoryIcon />,
    href: '/products',
  },
  {
    title: 'Orders',
    Icon: () => <LocalShippingIcon />,
    href: '/orders',
  },
  {
    title: 'Customers',
    Icon: () => <PersonIcon />,
    href: '/customer',
  },
  {
    title: 'Sales',
    Icon: () => <AttachMoneyIcon />,
    href: '/sales',
  },
  {
    title: 'In stock',
    Icon: () => <WarehouseIcon />,
    href: '/stock',
  },
];

export default function Root() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSidebarToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar
        mobileOpen={mobileOpen}
        handleSidebarToggle={handleSidebarToggle}
      />
      <Header handleSidebarToggle={handleSidebarToggle} />
      <Box component="main" sx={{ width: '100%' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  handleSidebarToggle: () => void;
}

function Sidebar({ mobileOpen, handleSidebarToggle }: SidebarProps) {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const { pathname } = useLocation();
  const mobileSidebar = windowWidth < lgBreakpoint;

  const updateWindowWidth = useCallback(
    (): void => setWindowWidth(window.innerWidth),
    []
  );

  useEffect(() => {
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  const sidebar = (
    <div>
      <Toolbar>
        <Typography variant="h5">{config.APP_NAME}</Typography>
      </Toolbar>
      <Divider />
      <List>
        {sidebarItems.map(({ title, Icon, href }, index) => (
          <ListItem key={index} selected={pathname === href} disablePadding>
            <ListItemButton component={Link} to={href}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
    >
      <Drawer
        variant={mobileSidebar ? 'temporary' : 'permanent'}
        open={mobileSidebar ? mobileOpen : true}
        onClose={handleSidebarToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {sidebar}
      </Drawer>
    </Box>
  );
}

interface HeaderProps {
  handleSidebarToggle: () => void;
}

function Header({ handleSidebarToggle }: HeaderProps) {
  const { auth } = useAuth();
  const theme: Theme = useTheme() as Theme;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const avatarLetters = (name: string): string => {
    return name.split(' ')[0][0];
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="h2"
            sx={{ display: { xs: 'none', lg: 'block' } }}
          >
            Inventory Management System
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{ display: { xs: 'block', lg: 'none' } }}
          >
            IMS
          </Typography>
        </Stack>
        <Stack
          id="menu-button"
          component={Button}
          spacing={1}
          direction="row"
          alignItems="center"
          onClick={handleClick}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
          >
            {avatarLetters(auth.user?.full_name || '')}
          </Avatar>
          <Typography sx={{ color: theme.palette.background.default }}>
            {auth.user?.full_name}
          </Typography>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {auth.user?.role === UserRoles.ADMIN && (
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add user account
            </MenuItem>
          )}
          <MenuItem disabled>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
