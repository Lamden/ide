import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';

const styles = ({
    root: {
        color: 'red',
        backgroundColor: '#E4ECF0',
    //    width: '100%',
        height: '100%'
    },
    heading: {
        padding: '5px',
        color: '#18103D',
    },
    headingErrors: {
        backgroundColor: '#ff6161'
    },
    headingChecking: {
        backgroundColor: '#ffbb61'
    },
    headingPass: {
        backgroundColor: '#86e686'
    },
    errorLine: {
        '&:hover' : {
            backgroundColor: '#574690',
            color: 'black',
        }
    },
    number: {
        color: 'black'
    },
    textNormal:{
        color: 'black'
    }
});

class ErrorBox extends Component {

    sortedErrors = () => {
        function compare( a, b ) {
            const aLineNum = parseInt(a.substring(a.indexOf("Line ") + 5, a.indexOf(":")));
            const bLineNum = parseInt(b.substring(b.indexOf("Line ") + 5, b.indexOf(":")));
            if ( aLineNum < bLineNum){return -1;}
            if ( aLineNum > bLineNum ){return 1;}
            return 0;
          }
          
        let errors =  this.props.errors;
        if (errors){
            try {
                let returnObj = errors.sort( compare );
                return returnObj;
            } catch (e) {
                return [e.message];
            }
        }
        return ['ok']
    }

    render() {
        const { classes } = this.props
        const errors = this.sortedErrors();
        return (
            <div style={{
                    
                   // height: this.props.height
                }}
                className={classNames(classes.root)}>

                <div className={classNames(classes.heading, { 
                                            [classes.headingChecking]: (errors.length === 0),
                                            [classes.headingPass]: (errors.length === 1 && (errors[0] === 'ok' || errors[0] === 'success!')),
                                            [classes.headingErrors]: (errors.length > 0) })}>
                    {'Console: '}
                </div>

                {errors ? 
                    errors.map((error, i) => { 
                        return (
                            <div key={i}>
                                <div className={classNames(classes.errorLine)}>
                                    <span className={classNames(classes.number)}>{(i+ 1) + ' - '}</span>
                                    <span className={classNames({}, {[classes.textNormal]: errors.length === 1 && (errors[0] === 'ok' || errors[0] === 'success!')})}>{error}</span>
                                </div>
                                <Divider variant="middle"/>
                            </div>
                        ) })
                : null
                }
            </div>
        );
    }
}

ErrorBox.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
   
export default withStyles(styles, { withTheme: true })(ErrorBox);