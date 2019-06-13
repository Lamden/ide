import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Lock, LockOpen } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  buttonIcon: {
      padding: '2px 0px',
  }
}));

export default function pluginButton(props) {
    const classes = useStyles();
    const [pluginInstalled, setPluginInstalled] = useState(false);
    const [pluginUnlocked, setPluginUnlocked] = useState(false);

    const eventWalletCheck = new CustomEvent("signPluginCheck", {bubbles: true});
    const eventUnlockCheck = new CustomEvent("signTx", {
        bubbles: true,
        detail: {
            network: "DTAU", 
            address: "Jeff", 
            rawTx: "stuff",
        },
    });

    useEffect(() => {
        if (props.initialized){
            document.addEventListener("signPluginInstalled", function(event) {
                setPluginInstalled(true);
            });

            window.addEventListener('message', function(event) {
                handleSignedTxMessage(event);
            });

            document.dispatchEvent(eventWalletCheck);
        }
    }, [props.initialized]);

    useEffect(() => {
        console.log(pluginInstalled);
        if (pluginInstalled){
            console.log('checking locked wallet')

            document.dispatchEvent(eventUnlockCheck);
        }
    }, [pluginInstalled]);

    function handleSignedTxMessage(e) {
       if (e.source === window && e.data){
            if (e.data.error === "Storage is locked") {
                setPluginUnlocked(false);
            }else{
                setPluginUnlocked(true);
            }
       }
    }



  return (

    <div>
        { pluginInstalled ?
            pluginUnlocked ?
                <Button variant="contained" color="primary" className={classes.button}>
                    Vault Installed
                    <LockOpen className={classes.buttonIcon}/>
                </Button>
            :
                <Button variant="contained" color="primary" className={classes.button}>
                    Vault Installed
                    <Lock className={classes.buttonIcon}/>
                </Button>
            
        :
            <Button href="https://docs.lamden.io/lamden-vault/" target="_blank" rel="noopener noreferrer"
                    variant="contained" color="secondary" className={classes.button} >     
                Vault Not Installed
            </Button>
        }

    </div>
  );
}