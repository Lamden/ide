import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import * as LShelpers from '../js/localstorage_helpers';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  list: {
    width: 250,
  },
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
}));

function Settings(props) {
  const classes = useStyles();
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [savedApiInfo, setSavedApiInfo] = useState(false);
  

  useEffect(() => {
    if (!initialized) {
      setSavedApiInfo(LShelpers.getApiInfo())
      setInitialized(true);
    }
  });

  useEffect(() => {
      setOpen(props.openSettings)
  },[props.openSettings]);


  const handleHostnameChange = () => event => {
      let apiInfo = LShelpers.getApiInfo();
      apiInfo.hostname = event.target.value;
      LShelpers.setApiInfo(apiInfo);
  };

  const handlePortChange = () => event => {
    let apiInfo = LShelpers.getApiInfo();
    apiInfo.port = event.target.value;
    LShelpers.setApiInfo(apiInfo);
  };


  function handleClose() {
    let apiInfo = LShelpers.getApiInfo(); 
    apiInfo.hostname = apiInfo.hostname === '' ? 'http:\\\\localhost' : apiInfo.hostname;
    apiInfo.hostname = apiInfo.hostname.indexOf('http:\\') === 0 || apiInfo.hostname.indexOf('https:\\')  === 0 ? apiInfo.hostname : 'http:\\\\' + apiInfo.hostname;
    apiInfo.port = apiInfo.port === '' ? '8080' : apiInfo.port;
    LShelpers.setApiInfo(apiInfo);
    if(JSON.stringify(apiInfo) !== JSON.stringify(savedApiInfo) ){ props.connectToAPI(); }
    setSavedApiInfo(apiInfo);
    toggleDrawer();
  }

  function handleCloseCancel() {
    LShelpers.setApiInfo(savedApiInfo);
    toggleDrawer();
  }

  function toggleDrawer() {
    props.toggleSettings();
  };

  const fullList = side => (
    <div className={classes.fullList}>
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Contract API Server Information</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TextField
              id="api-hostname"
              label="HostName"
              className={classNames(classes.margin, classes.textField)}
              onChange={handleHostnameChange()}
              margin="normal"
              defaultValue={ LShelpers.getApiInfo().hostname }
              helperText="blank for http:\\localhost"
            />
            <TextField
              id="api-port"
              label="Port"
              className={classNames(classes.margin, classes.textField)}
              onChange={handlePortChange()}
              margin="normal"
              defaultValue={ LShelpers.getApiInfo().port }
              helperText="blank for port 8080"
            />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Danger Zone</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <Button onClick={() => LShelpers.init_file_storage()}>
          Wipe Local Storage
        </Button>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <div className={classes.buttons}>
        <Button className={classes.button} variant="contained" color="primary" onClick={() => handleClose()}>Save</Button>
        <Button className={classes.button} variant="contained"  onClick={() => handleCloseCancel()}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div>
        <Drawer anchor="top" open={open} onClose={() => handleClose()}>
          {fullList('top')}
        </Drawer>
    </div>
  );

}

export default Settings;
