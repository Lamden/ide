import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Lock, LockOpen } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  }
}));

export default function pluginButton(props) {
    const classes = useStyles();
    const [pluginInstalled, setPluginInstalled] = useState(false);

    useEffect(() => {
        if (props.initialized){
            document.addEventListener("signPluginInstalled", function(event) { // (1)
                setPluginInstalled(true);
            });

            const eventWalletCheck = new CustomEvent("signPluginCheck", {bubbles: true}); // (2)
            document.dispatchEvent(eventWalletCheck);
        }
        /*
        return () => {
            if (props.initialized){document.removeEventListener("signPluginInstalled", eventWalletCheck)}
        }*/
    }, [props.initialized]);



  return (
    <div>
        { pluginInstalled ?
            <Button variant="contained" color="primary" className={classes.button}>
                Vault Installed 
            </Button>

        :
            <Button variant="contained" color="secondary" className={classes.button}>     
                Vault Not Installed
            </Button>
        }

    </div>
  );
}