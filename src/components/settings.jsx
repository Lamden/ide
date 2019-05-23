import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

import Cookies from 'universal-cookie';
const cookies = new Cookies();


const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0,0,0,.125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: 'auto',
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,.03)',
    borderBottom: '1px solid rgba(0,0,0,.125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
}))(MuiExpansionPanelDetails);

const styles = {
  fullList: {
    width: 'auto',
  },
  buttons: {
    textAlign: 'center',
    padding: '10px',
  },
  button: {
    margin: '10px',
  }

};

class Settings extends React.Component {
  constructor(props) { 
    super(props);
      this.state = {
        open: false,
        expanded: "panel1",
        port: '',
        name: ''
      };

      this.hostname = cookies.get('apiInfo').hostname === '' ? 'http:\\\\localhost' : cookies.get('apiInfo').hostname;
      this.port = cookies.get('apiInfo').port === '' ? '8080' : cookies.get('apiInfo').port;
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  toggleDrawer = () =>{
    this.setState({
      open: !this.state.open,
    });
  }

  handleChange = panel => (event, expanded) => {
    this.setState(
      {
        expanded: expanded ? panel : false
      }
    );
  };

  handleHostnameChange = name => event => {
    let apiInfo = cookies.get('apiInfo');
    apiInfo.hostname = event.target.value;
    cookies.set('apiInfo', apiInfo);
  };

  handlePortChange = name => event => {
    let apiInfo = cookies.get('apiInfo');
    apiInfo.port = event.target.value;
    cookies.set('apiInfo', apiInfo);
  };


  handleClose = () => {
    let apiInfo = cookies.get('apiInfo');   
    apiInfo.hostname = apiInfo.hostname === '' ? 'http:\\\\localhost' : apiInfo.hostname;
    apiInfo.hostname = apiInfo.hostname.indexOf('http:\\') === 0 || apiInfo.hostname.indexOf('https:\\')  === 0 ? apiInfo.hostname : 'http:\\\\' + apiInfo.hostname;
    apiInfo.port = apiInfo.port === '' ? '8080' : apiInfo.port;
    cookies.set('apiInfo', apiInfo);
    this.toggleDrawer();
    this.props.retryAPI(cookies.get('apiInfo').hostname, cookies.get('apiInfo').port)
  }

  handleOpen = () => {
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    const fullList = (
      <div className={classes.fullList}>
        <ExpansionPanel
          square
          expanded={expanded === 'panel1'}
          onChange={this.handleChange('panel1')}
        >
          <ExpansionPanelSummary>
            <Typography>API Server</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TextField
              id="api-hostname"
              label="HostName"
              className={classNames(classes.margin, classes.textField)}
              onChange={this.handleHostnameChange('hostname')}
              margin="normal"
              defaultValue={cookies.get('apiInfo').hostname}
              helperText="blank for http:\\localhost"
            />
            <TextField
              id="api-port"
              label="Port"
              className={classNames(classes.margin, classes.textField)}
              onChange={this.handlePortChange('port')}
              margin="normal"
              defaultValue={cookies.get('apiInfo').port === '' ? '8080' : cookies.get('apiInfo').port }
              helperText="blank for port 8080"
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          square
          expanded={expanded === 'panel2'}
          onChange={this.handleChange('panel2')}
        >
          <ExpansionPanelSummary>
            <Typography>Something Else</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <div className={classes.buttons}>
          <Button className={classes.button} variant="contained" color="primary" onClick={() => this.handleClose()}>Save</Button>
          <Button className={classes.button} variant="contained"  onClick={() => this.handleClose()}>Cancel</Button>
        </div>
        
      </div>
    );

    return (
      <div>
        <SwipeableDrawer
          
          anchor="top"
          open={this.state.open}
          onClose={() => this.handleClose()}
          onOpen={() => this.handleOpen()}
        >
          <div
            tabIndex={0}
            role="button"
          >
            {fullList}
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
