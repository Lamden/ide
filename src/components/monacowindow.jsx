import React, { Component } from 'react';

class MonacoWindow extends Component {
    render() {
        return (
          <div id="monaco-container" className="monaco-window" />
        );
    }

    componentDidMount() {
        import("monaco-editor").then(monaco => {       
            monaco.editor.create(document.getElementById('monaco-container'), {
                value: [
                    '# This where the revolution starts...',
                ].join('\n'),
                language: 'python'
            });
        });
    }
}
   
  export default MonacoWindow