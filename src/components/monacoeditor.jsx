import React, { Component } from 'react';

const PORT = '8080'
const API = 'http://localhost:' + PORT;


class MonacoWindow extends Component {
  constructor(props) { 
      super(props); 
      this.clickController = this.clickController.bind(this);
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
        this.props.setClick(this.clickController);
      })
  }

  testAPI1 = () => {
    const ENDPOINT = '/';
    fetch(API + ENDPOINT)
    .then(response => response.text())
    .then(data => this.setValue(data));
  }

  testAPI2 = () => {
    const ENDPOINT = '/contracts';
    fetch(API + ENDPOINT)
    .then(response => response.json())
    .then(data => console.log(data));
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  getCurrentValue = () =>{
    return this.editor.getValue();
  }

  setValue = (value) =>{
    return this.editor.setValue(value);
  }

  clickController = (action) =>{
    switch(action) {
      case "Check":
        console.log("Checking code");
        this.testAPI1();
        break;
      case "Submit":
        console.log("Submitting code");
        this.testAPI2();
        break;
      default:
        break;
    }

  }

  setNewValue = (value) =>{
    this.editor.setValue(value);
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
        </div>
      );
  }


}
   
export default MonacoWindow