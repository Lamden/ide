import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import { Popover, TextField, Typography, Button } from '@material-ui/core';
import { Edit, SaveAlt, Close } from '@material-ui/icons';

//Import Utils
import * as LShelpers from '../../js/localstorage_helpers';


const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  popover:{
    textAlign: 'center',
  },
  popoverClose:{
    padding: '10px',
  },
  popoverButton:{
    margin: '5px'
  }
}));


function EditTab(props) {
  const { className } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popoverType, setPopoverType] = React.useState('');
  const [newName, setNewName] = React.useState(props.tabName);
  const [helperText, setHelperText] = React.useState('');

  function downloadTxtFile() {
    const element = document.createElement("a");
    const file = new Blob([props.getTabValue(props.tabName)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = props.tabName + '.py';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const handleChange = () => event => {
    setNewName(event.target.value);
};

  function handleEditClick(event) {
    setPopoverType('edit')
    setAnchorEl(event.currentTarget);
  }

  function handleRename(){
    if (props.name !== newName){
      if (LShelpers.nameExists(newName)){
        setHelperText('duplicate name')
        return
      }
      if(LShelpers.renameTab(props.tabName, newName, props.getTabValue(props.tabName))){
        props.refreshTabs();
      }
    }
    handleClose();
  }

  function handleCloseClick(event){
    setPopoverType('close')
    setAnchorEl(event.currentTarget);
  }

  function handleSave() {
    LShelpers.setFile(props.tabName, props.getTabValue(props.tabName), 'local')
  }

  function handleClose() {
    setAnchorEl(null);
    setPopoverType('')
    
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : null;

  return (
    <span>
      <SaveAlt className={className} onClick={downloadTxtFile}/>
      <Edit className={className} onClick={handleEditClick}/>
      <Close className={className} onClick={handleCloseClick}/>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className={classes.popover}
      >
      {popoverType === 'edit' ? 
        <div>
          <div>
          <TextField
            onChange={handleChange()}
            id={props.tabName}
            label={props.tabName}
            error={helperText === 'duplicate name'}
            className={clsx(classes.textField, classes.dense)}
            placeholder={props.tabName}
            helperText={helperText}
            margin="dense"
            variant="outlined"
            />
            </div>
            <Button onClick={handleRename}>rename</Button>
          </div>
        : null}

        {popoverType === 'close' ? 
          <div className={classes.popoverClose}>
            <div >
              <div>
                <Typography>All content in this tab will delete</Typography>
              </div>
              <div>
                <Typography>Are you sure?</Typography>
              </div>
              <Button className={classes.popoverButton} onClick={() => props.closeTab(props.tabName, 'local')}>Yes</Button>
              <Button className={classes.popoverButton} onClick={handleClose}>No</Button>
            </div>
          </div>
        : null}
      </Popover>
      
    </span>
  );
}

export default EditTab;