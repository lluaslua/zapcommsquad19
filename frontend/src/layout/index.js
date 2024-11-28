import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
import moment from "moment";
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  MenuItem,
  IconButton,
  Menu,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CachedIcon from "@material-ui/icons/Cached";

import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import NotificationsVolume from "../components/NotificationsVolume";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import DarkMode from "../components/DarkMode";
import { i18n } from "../translate/i18n";
import toastError from "../errors/toastError";
import AnnouncementsPopover from "../components/AnnouncementsPopover";

import logo from "../assets/logo.png";
import logoclara from "../assets/logoclara.png";
import { SocketContext } from "../context/Socket/SocketContext";
import ChatPopover from "../pages/Chat/ChatPopover";

import { useDate } from "../hooks/useDate";

import ColorModeContext from "../layout/themeContext";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100dvh",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100dvh - 56px)",
    },
    backgroundColor: theme.palette.fancyBackground,
    '& .MuiButton-outlinedPrimary': {
      color: theme.mode === 'light' ? '#FFF' : '#FFF',
	  //backgroundColor: theme.mode === 'light' ? '#682ee2' : '#682ee2',
	backgroundColor: theme.mode === 'light' ? theme.palette.primary.main : '#1c1c1c',
      //border: theme.mode === 'light' ? '1px solid rgba(0 124 102)' : '1px solid rgba(255, 255, 255, 0.5)',
    },
    '& .MuiTab-textColorPrimary.Mui-selected': {
      color: theme.mode === 'light' ? 'Primary' : '#FFF',
    }
  },

  
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    fontSize: 14,
    color: "white",
  },
  drawerPaper: {
    background: "transparent", // Fundo transparente
    color: "#FFFFFF",
    position: "relative",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      width: "70%",
    },
    overflow: "hidden", // Impede vazamentos
    boxShadow: "none", // Remove sombras desnecessárias
  },

  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7), // Largura reduzida para desktops
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
    [theme.breakpoints.down("sm")]: {
      width: 0, // Esconde completamente em telas pequenas
    },
    background: "transparent", // Remove o fundo azul no estado fechado
    boxShadow: "none", // Remove sombras no estado fechado
  },
  appBarSpacer: {
    minHeight: "48px",
  },
  content: {
    flex: 1,
    overflow: "auto",

  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  containerWithScroll: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  NotificationsPopOver: {   
    // color: theme.barraSuperior.secondary.main,
  },

}));

const LoggedInLayout = ({ children, themeToggle }) => {
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detecta se está em celular

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen); // Alterna entre abrir e fechar a sidebar
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <div className={classes.root}>
      {/* Drawer (Sidebar) */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"} // Temporário em mobile, permanente em desktop
        className={drawerOpen ? classes.drawerPaper : classes.drawerPaperClose}
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !drawerOpen && classes.drawerPaperClose
          ),
        }}
        open={drawerOpen} // Controlado pelo estado drawerOpen
        onClose={toggleDrawer} // Fecha o Drawer ao clicar fora (em mobile)
        PaperProps={{
          style: {
            background: "#0C2C54",
            overflow: "hidden",
          },
        }}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon style={{ color: "#FFFFFF" }} />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.containerWithScroll}>
          <MainListItems drawerClose={toggleDrawer} collapsed={!drawerOpen} />
        </List>
        <Divider />
      </Drawer>

      {/* AppBar - apenas em dispositivos móveis */}
      {isMobile && (
        <AppBar
          position="absolute"
          className={clsx(
            classes.appBar,
            drawerOpen && classes.appBarShift && classes.menuButtonHidden
          )}
          color="primary"
        >
          <Toolbar
            variant="dense"
            className={classes.toolbar && classes.menuButtonHidden}
          >
            <IconButton
              edge="start"
              variant="contained"
              aria-label="open drawer"
              onClick={toggleDrawer} // Abre o Drawer ao clicar no botão
              className={clsx(
                classes.menuButton,
                drawerOpen && classes.menuButtonHidden
              )}
            >
              <MenuIcon style={{ color: "#FFFFFF" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {children ? children : null}
      </main>
    </div>
  );
};

export default LoggedInLayout;