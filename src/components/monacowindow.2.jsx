import React, { Component } from 'react';
//import MonacoEditor from 'react-monaco-editor';

class MonacoWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageWidth: window.innerWidth,
      pageHeight: window.innerHeight
    }
  }

  handleResize = e => {
    this.setState({pageWidth: window.innerWidth, pageHeight: window.innerHeight});
  };

  componentDidMount() {
    import("monaco-editor")
      .then(monaco => { monaco.editor.create(document.getElementById('monaco-container'), {
                        value: '',
                        language: 'python',
                        width: window.innerWidth,
                        height: '1000px'
                      });
      });
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  editorDidMount(editor, monaco) {
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }
  
  render() {
 //   const code = this.props.value + ' ' + this.state.pageWidth;
  //  const width = this.state.pageWidth - 150;
   // const height = this.state.pageHeight - 150;
  //  const options = {
  //    selectOnLineNumbers: true
  //  };
    return (
      <div id="monaco-container" className="monaco-window">
      {/*
        <MonacoEditor
          width={width}
          height={height}
          language="python"
          theme="vs-light"
          value={code}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
      */}
      </div>
    );
  }
}

export default MonacoWindow