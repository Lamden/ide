import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Input } from '@material-ui/icons';
import { TextField, Paper } from '@material-ui/core';




const styles = theme => ({
    root: {
        color: '#512354',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '15px',
    },
    textField: {
        marginLeft: '5px',
        marginRight: '5px',
        width: '45%',
      },
      methodBox: {
        padding:' 5px',
        margin: '5px',
        backgroundColor: '#e8edfd',
      },
      headings:{
        marginTop: '0',
      },
      methodRow: {
        color: '#512354',
        backgroundColor: '#d7def7',
        padding: '3px',
        display: 'inline-flex',
        width: '100%',
      },
      methodName: {
        fontSize: '1em',
        marginLeft: '5px',
        fontWeight: 'bold',
      },
      runIcon: {
          
      },
      paperBox: {
          margin: '0 5px 10px',
          padding: '0 5px',
          borderTop: '2px solid #45387F',

      }
});

class MetaContract extends Component {

    render() {
        const { classes } = this.props

        return (
            <div className={classNames(classes.root)}
                style={{
                    height: this.props.height
                }}>
                <Paper className={classNames(classes.paperBox)}>
                <h2 className={classNames(classes.headings)}>Methods</h2>
                {this.props.methods ?
                    this.props.methods.map(function(method, methodIndex){
                        if (method.name !== "____"){
                            return <div key={methodIndex} className={classNames(classes.methodBox)}>
                                    <div className={classNames(classes.methodRow)}>
                                        <span className={classNames(classes.runIcon)}><Input /></span>
                                        <span className={classNames(classes.methodName)}>{method.name}</span>
                                    </div>
                                    
                                        {method.arguments.map(function(arg, argIndex){
                                            return      <TextField
                                                            key={method+argIndex}
                                                            id={method+argIndex}
                                                            label={arg}
                                                            className={classes.textField}
                                                            margin="normal"
                                                        />
                                            
                                        })}
                                </div>
                        }else{return null}
                        
                        
                    })
                : 'None' }
                </Paper>
                <Paper className={classNames(classes.paperBox)}>
                <h2>Variables</h2>
                {this.props.variables ?
                    this.props.variables.map(function(variable, variableIndex){
                        return null
                        
                    })
                : 'None' }
                </Paper>

            </div>
        );
    }
}

MetaContract.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
   
export default withStyles(styles, { withTheme: true })(MetaContract);