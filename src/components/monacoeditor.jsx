import React, { Component } from 'react';

class MonacoWindow extends Component {
  constructor(props) 
  { 
      super(props); 
      this.editor = null; 
      this.monaco = null;
  }

  componentDidMount() {
    import("monaco-editor")
      .then( monaco => {
        this.monaco = monaco;
        this.editor = this.monaco.editor.create(document.getElementById("container"), {
          value: this.props.value,
          language: "python"
        });
      })
}

handleButtonClick = () =>{
  console.log('click');
  console.log(this.editor.getValue());
}

addDecoration = () => {
  this.editor.deltaDecorations([], [
    { range: new this.monaco.Range(3,1,5,1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }},
    { range: new this.monaco.Range(7,1,7,24), options: { inlineClassName: 'myInlineDecoration' }},
  ]);
}


  render() {
      return (
        <div>
          <div id="container" className="monaco-window" />
          <button onClick={this.addDecoration}>alert</button>
        </div>
      );
  }


}
   
export default MonacoWindow