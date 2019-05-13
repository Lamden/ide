import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';

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
                return e.message;
            }
        } 
        return null;
    }

    render() {
        const errors = this.sortedErrors();
        return (
            <div style={{
                    width: this.props.width ? this.props.width : '500px', 
                    height: this.props.height
                }}
                className="errorbox-container">
                <div className="heading">{'Error Console'}</div>
                    {errors ? 
                        errors.map((error, i) => { 
                            return (
                                <div>
                                <div key={i} className="errorLine">
                                    <span className="number">{(i+ 1) + ' - '}</span>
                                    <span className="message">{error}</span>
                                    
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
   
export default ErrorBox