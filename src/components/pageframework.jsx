import React, { useState, useEffect } from 'react';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import {Drawer, AppBar, Toolbar, Button, List, CssBaseline, 
        Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText
        } from '@material-ui/core';

import {FiberManualRecord, Publish, CheckCircleOutline
        } from '@material-ui/icons';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withSnackbar } from 'notistack';


//Import Components
import Settings from "../components/settings";
import MonacoEditor from "../components/monacoeditor";

//Import Utils
import * as API from '../js/contracting_api';
import * as LShelpers from '../js/localstorage_helpers';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 5,
    marginLeft: theme.spacing.unit * 6,
    width: '20%',
    minWidth: '250px',
    [theme.breakpoints.only('xs')]: {
      marginLeft: theme.spacing.unit * 3,
      minWidth: '200px'
    },
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
   // padding: theme.spacing.unit * 3,
  },
  statusOnline: {
    fill: 'green',
  },
  statusOffline: {
    fill: 'red',
  },
  statusPending: {
    fill: 'orange',
  }
}));

function PageFramework(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [apiStatus, setApiStatus] = useState(undefined);
  const [newContract, setNewContract] = useState('');
  const [windowState, setWindowState] = useState({ height: 0, width:0 });

  //Set Refs
  const [monacoEditor, setMonacoEditor] = useState(undefined);
  function setMonacoRef (ref){
    setMonacoEditor(ref)
  }

  useEffect(() => {
    const setFromEvent = e => setWindowState({ height: e.target.innerHeight, width: e.target.innerWidth });
    window.addEventListener('resize', setFromEvent);
    return () => {
      window.addEventListener('resize', setFromEvent);
    };
  }, []);

  useEffect(() => {
    if (!initialized) {
      setWindowState({height: window.innerHeight, width: window.innerWidth})
      connectToAPI();
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (apiStatus === undefined) {return}
    props.enqueueSnackbar('API Server ' + apiStatus, { variant: apiStatus !== 'Online' ? apiStatus === 'Connecting...' ? 'info' : 'default'  : 'success' });
  }, [apiStatus]);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  function toggleSettings() {
    setOpenSettings(!openSettings);
  }

  function connectToAPI(){
    setApiStatus('Connecting...');
    API.apicheck()
      .then(data => data === 'indeed' ? setApiStatus('Online') : setApiStatus('Offline'))
      .catch(e => handleApiError(e));
  }

  function handleApiError(error) {
    setApiStatus('Offline')
    const apiInfo = LShelpers.getApiInfo();
    
      if (!error){
        props.enqueueSnackbar('Unknown API Server Error', { variant: 'error' });
        return
      } 
      if (error.message === 'Failed to fetch'){
        props.enqueueSnackbar('Unable to connect to API endpoint ' + apiInfo.hostname + ':' + apiInfo.port + '. Check API settings.', { variant: 'error' });
        return;
      }
      props.enqueueSnackbar(error, { variant: 'error' });
  }
/*
  function handleSearchChoice(contract) {
    let openFiles = cookies.get('openfiles');
    if(!openFiles){
        cookies.set('openfiles', [contract])
    }else{
      if (openFiles.indexOf(contract) === -1){
        openFiles.push(contract)
        cookies.set('openfiles', openFiles) 
      }
    }
    this.setState({ newContract: [contract] })
  }
*/

  return (
    <div className={classes.root}>
      <CssBaseline />
     <Settings connectToAPI={() => connectToAPI()} openSettings={openSettings} toggleSettings={() => toggleSettings()}/>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{'backgroundColor': '#512354'}}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => handleDrawerOpen()}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap>
            Lamden Contracting
          </Typography>
          <div className={classes.grow} />
          <Button color="inherit" onClick={() => toggleSettings()}>Settings</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={() => handleDrawerClose()}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem key='apistatus' title={'API Connection ' + apiStatus} onClick={() => connectToAPI()}>
              <ListItemIcon> 
                <FiberManualRecord className={clsx({
                                                          [classes.statusOnline]: apiStatus === 'Online',
                                                          [classes.statusPending]: apiStatus === 'Connecting...',
                                                          [classes.statusOffline]: apiStatus === 'Offline'}
                                                        )}/>
              </ListItemIcon>
              <ListItemText primary={'API ' + apiStatus} />
            </ListItem>
            <ListItem button key='Lint' onClick={() => monacoEditor.clickController('Lint')}>
              <ListItemIcon><CheckCircleOutline /></ListItemIcon>
              <ListItemText primary='Error Check' />
            </ListItem>
            <ListItem button key='Submit' onClick={() => monacoEditor.clickController('Submit')}>
              <ListItemIcon><Publish /></ListItemIcon>
              <ListItemText primary='Submit' />
            </ListItem>
          </List>
      </Drawer>
      <main className={classes.content}>
        <MonacoEditor 
          monacoRef={ref => setMonacoRef(ref)}
          apiStatus={apiStatus}
          newContract={newContract}
          width={open ? ((windowState.width - drawerWidth)) : windowState.width}
          height={windowState.height}
          drawerOpen = {open}
        />
      </main>
    </div>
  )
}

export default withSnackbar(PageFramework);