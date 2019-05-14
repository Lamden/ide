import React, { Component } from 'react';

import * as API from '../js/contracting_api.ts';
import ErrorBox from "../components/errorbox"

const errorBoxHeight = 200;
const appBarHeight = 100;

const EditorContainer = (props) => {
  return <div
          style={{
            width: props.width ? props.width : '500px', 
            height: props.height ? props.height - (errorBoxHeight + appBarHeight) : '500px' , 
            margin: '5rem 0 0'}}
          id="editor-container"></div>
};


class MonacoWindow extends Component {
  constructor(props) { 
      super(props);
      this.clickController = this.clickController.bind(this);
      this.state = {
        errors: ''
      }
      this.editor = null; 
      this.monaco = null;
  }

  componentDidMount() {
    import("monaco-editor")
      .then( monaco => {
        this.monaco = monaco;
        this.editor = this.monaco.editor.create(document.getElementById("editor-container"), {
          value: this.props.value,
          language: "python",
          automaticLayout: true

        });
        this.props.setClick(this.clickController);
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    console.log(this.props.ApiInfo)
   // console.log(prevProps.newContract)
   // console.log(this.props.newContract)
   // console.log(this.props.newContract === prevProps.newContract)
    if (this.props.newContract && this.props.newContract != prevProps.newContract){
    //  console.log(this.props.newContract[0]);
      console.log(this.props.ApiInfo)
      API.contract(this.props.ApiInfo, this.props.newContract[0]).then(data => this.setEditorValue(data.toString()));
    }
  }

  clickController = (action) =>{
    switch(action) {
      case "CheckAPI":
        API.apicheck().then(data => this.setEditorValue(data))
        break;
      case "Contracts":
        API.contracts().then(data => this.setEditorValue(data.toString()));
        break;
      case "Contract":
        API.contract('submission').then(data => this.setEditorValue(data.toString()));
        break;
      case "Lint":
        API.lint('testName', this.getEditorValue()).then(data => this.handleErrors(JSON.parse(data.toString())));
        break;
      case "AddDecoration":
        this.addDecoration();
      break;
      case "DelDecoration":
        this.delDecoration();
      break;
      default:
        break;
    }
  }

  getEditorValue = () =>{
    return this.editor.getValue();
  }

  setEditorValue = (value) =>{
    return this.editor.setValue(value);
  }

  handleErrors = (errors) => {
    this.setState({ errors });
  }

  addDecoration = () => {
    this.editor.deltaDecorations([], [
      { range: new this.monaco.Range(3,1,5,1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }},
      { range: new this.monaco.Range(7,1,7,24), options: { inlineClassName: 'myInlineDecoration' }},
    ]);
  }

  delDecoration = () => {
    this.editor.deltaDecorations([], []);
  }

  render() {
      return (
        <div>
            <EditorContainer width={this.props.width} height={this.props.height} className="monaco-window" />
            <ErrorBox width={this.props.drawerOpen ? this.props.width : this.props.width - 73} height={errorBoxHeight} errors={this.state.errors} />
        </div>
      );
  }
}
   
export default MonacoWindow;