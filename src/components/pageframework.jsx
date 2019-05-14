import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Publish from '@material-ui/icons/Publish';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import { fade } from '@material-ui/core/styles/colorManipulator';


import MonacoEditor from "../components/monacoeditor"
import ContractSearch from "../components/fragments/contractsearch"
import * as API from '../js/contracting_api.ts';


const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
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
    marginLeft: 0,
    width: '120%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
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
});

class PageFramework extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      editorWidth: '90vw',
      editorValue:  [ '# This is where the revolution begins... \n', ' \n', ' \n', ' \n'].join('\n'),
      newContract: undefined,
      windowHeight: undefined,
      windowWidth: undefined,
      ApiInfo: {status:'Offline', server:'http://localhost', port: '8080'},
    };
    
    /*
     Bind our childHandler function to this context
     that will get called from our Child component
    */
   
}

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
    this.connectToAPI();

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  changeApiServer = (newServer, port) => {
    let apiInfo = this.state.ApiInfo;
    apiInfo.server = newServer;
    apiInfo.port = port;
    this.setState({ApiInfo: apiInfo}, () => {
      this.connectToAPI(this.state.ApiInfo.server);
    });
  }

  connectToAPI = () => {
    let apiInfo = this.state.ApiInfo;
    apiInfo.status = 'Pending';
    this.setState({ ApiInfo: apiInfo }, () => {
      API.apicheck(this.state.ApiInfo).then(data => this.setApiStatus(data));
    });
  }

  setApiStatus = (status) => {
    let apiInfo = this.state.ApiInfo;
    apiInfo.status = 'Online';
    if (status === 'indeed'){
      apiInfo.status = this.state.ApiInfo
      apiInfo.status = 'Online';
    }
    this.setState({ApiInfo: apiInfo});
  }

  handleDrawerOpen = () => {
    this.setState({ open: true, editorWidth: '80vw' });
  };

  handleDrawerClose = () => {
    this.setState({ open: false, editorWidth: '90vw' });
  };

  handleSubmitClick = () =>{
    this.setState({ open: true, editorValue: 'Now this' });
  }

  setNewValue = (contract) => {
    this.setState({
      newContract: [contract],
    })
  }

  handleResize = () => this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  });

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open
          })}
        >
          <Toolbar disableGutters={!this.state.open} style={{'backgroundColor': '#512354'}}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {
                [classes.hide]: this.state.open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Lamden
            </Typography>
            <div className={classes.search}>
              <ContractSearch ApiInfo={this.state.ApiInfo} selectedContract={this.setNewValue}/>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem key='apistatus' title={'API Connection ' + this.state.ApiInfo.status}>
              <ListItemIcon> 
                <FiberManualRecord className={classNames({
                                                          [classes.statusOnline]: this.state.ApiInfo.status === 'Online',
                                                          [classes.statusPending]: this.state.ApiInfo.status === 'Pending',
                                                          [classes.statusOffline]: this.state.ApiInfo.status === 'Offline'}
                                                        )}
                />

              </ListItemIcon>
              <ListItemText primary={'API ' + this.state.ApiInfo.status} />
            </ListItem>
            <ListItem button key='Lint' onClick={() => this.ClickController('Lint')}>
              <ListItemIcon><CheckCircleOutline /></ListItemIcon>
              <ListItemText primary='Error Check' />
            </ListItem>
            <ListItem button key='Submit' onClick={() => this.ClickController('Submit')}>
              <ListItemIcon><Publish /></ListItemIcon>
              <ListItemText primary='Submit' />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
            <MonacoEditor 
              setClick={click => this.ClickController = click}
              ApiInfo={this.state.ApiInfo}
              value={this.state.editorValue}
              newContract={this.state.newContract}
              width={this.state.open ? this.state.windowWidth - drawerWidth : this.state.windowWidth}
              height={this.state.windowHeight}
              drawerOpen = {this.state.open}
              action={this.editorHandler}/>
        </main>
      </div>
    );
  }
}

PageFramework.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PageFramework);