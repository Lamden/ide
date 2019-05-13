import React, { Component } from 'react';

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
                width: this.props.width, 
                height: this.props.height}} 
                className="errorbox-container">

                <ul>
                    {errors ? 
                        errors.map((error, i) => { return <li className="errorLine" key={i} >{error}</li> })
                    : null
                    }
                </ul>
            </div>
        );
    }
}
   
export default ErrorBox