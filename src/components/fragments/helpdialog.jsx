import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  section: {
    marginTop:'2rem',
  },
  list:{
    marginLeft: '15px',
  }
}));

function HelpDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');

  useEffect(() => {
    setOpen(props.openHelp)
},[props.openHelp]);

  function handleClose() {
    props.toggleHelp();
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Help</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className={classes.section}>
            Quick Start
            </div>
            <div>
              To use the Lamden Contracting site you need to attach it to a development server. This will allow you to create, validate and test your contracts
               before making them live on Lamden's blockchain.
            </div>
            <div className={classes.list}>
              <div>
                1. Setup a Contracting Dev server by following the instructions on {' '}
              <a href='https://github.com/Lamden/contracting' target="_blank" rel="noopener noreferrer" >{'github'}</a>
              </div>
              <div>
                2. Run 'Python3 contracting/webserver.py' to start the dev server.
              </div>
              <div>
                3. Go to settings and setup the hostname and port of your dev server
              </div>
            </div>
            <div className={classes.section}>
              Notes
            </div>
            <div>
              All file content is saved in your local browser storage and be available to you in each session. If you close a tab the content will be GONE.
            </div>
            <div>
              You save a copy of any tab by clicking the "download" button on the tab.
            </div>
            
              
              


            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default HelpDialog;