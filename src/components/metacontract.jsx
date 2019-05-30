import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Input } from '@material-ui/icons';
import { TextField, Paper } from '@material-ui/core';

//Import Components
import ContractSearch from "../components/fragments/contractsearch";

//Import Utils
import * as API from '../js/contracting_api';


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
        width: '98%',
      },
      methodBox: {
        padding:' 5px',
        margin: '5px',
        backgroundColor: '#e8edfd',
      },
      headings:{
        marginTop: '0',
      },
      headingsDisabled: {
        color: 'grey',
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
        marginTop: '2px',
        fontWeight: 'bold',
      },
      runIcon: {
          
      },
      paperBox: {
          margin: '10px 0px 10px 10px',
          padding: '5px',
         // borderTop: '2px solid #45387F',
      }
});

class MetaContract extends Component {
    constructor(props) { 
        super(props);
        this.state = {
          apiStatus: 'Offline',
          methods: undefined,
          variables: undefined
        }
    }

    componentDidUpdate(){
        if (this.props.apiStatus !== this.state.apiStatus){
          this.setState({ apiStatus: this.props.apiStatus })
        }
    }

    getMeta = (name) => {
        if (name){
            API.methods(name)
            .then(data => !data.error ? this.setState({methods: data.methods}) : null);
            API.variables(name)
            .then(data => !data.error ? this.setState({variables: data.variables}) : null);
        }else{
            this.setState({methods: undefined, variables: undefined})
        }
      }

    render() {
        const { classes } = this.props

        return (
            <div className={classNames(classes.root)}
                style={{
                    height: this.props.height
                }}>
                    
                <ContractSearch 
                    apiStatus={this.state.apiStatus} 
                    getMeta={(name) => this.getMeta(name)} 
                    openCode={(name, code, source) => this.props.openCode(name, code, source)}
                />

                <Paper className={classNames(classes.paperBox)}>
                <h3 className={classNames(classes.headings, {[classes.headingsDisabled]: this.state.apiStatus === 'Offline'})}>Methods</h3>
                {this.state.methods ?
                    this.state.methods.map(function(method, methodIndex){
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
                : null }
                </Paper>
                
                <Paper className={classNames(classes.paperBox)}>
                <h3 className={classNames(classes.headings, {[classes.headingsDisabled]: this.state.apiStatus === 'Offline'})}>Variables</h3>
                {this.state.variables ?
                    this.state.variables.map(function(variable, variableIndex){
                        return null
                        
                    })
                : null }
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