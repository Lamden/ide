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
    const [pluginLocked, setPluginLocked] = useState((prevState) => {
        return {...prevState, pluginLocked}
    });

    useEffect(() => {
        if (props.initialized){
            document.addEventListener("signPluginInstalled", function(event) {
                setPluginInstalled(true);
            });

            window.addEventListener('message', function(event) {
                handleSignedTxMessage(event);
            });
            const eventWalletCheck = new CustomEvent("signPluginCheck", {bubbles: true});

            document.dispatchEvent(eventWalletCheck);
        }
    }, [props.initialized]);

    useEffect(() => {
        if (pluginInstalled){
            const eventUnlockCheck = new CustomEvent("signTx", {
                bubbles: true,
                detail: {},
            });
            document.dispatchEvent(eventUnlockCheck);
        }
    }, [pluginInstalled]);

    useEffect(() => {
        console.log('value changed to ' + pluginLocked);
    }, []);

    function handleSignedTxMessage(e) {
        console.log(e.data);
        if (e.source === window && e.data){
            if (e.data.type === 'locked' ){
                console.log(e.data.locked ? 'wallet is locked' :  'wallet is unlocked' )
                console.log(pluginLocked ? 'icon is closed lock' :  'icon is open lock' )
                console.log(e.data.locked !== pluginLocked ? 'changing icon' : 'not chaning icon')
                if (e.data.locked !== pluginLocked){
                    setPluginLocked(e.data.locked);
                }
            }

            if (e.data.type === 'signedTx') {
                if (e.data.error === "Storage is locked"){
                    setPluginLocked(true);
                }else{
                    setPluginLocked(false);
                }
            }
       }
    }

  return (

    <div>
        { pluginInstalled ?
                <Button variant="contained" color="primary" className={classes.button}>
                    Vault Installed
                    {pluginLocked ? <Lock className={classes.buttonIcon}/> : <LockOpen className={classes.buttonIcon}/>}
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