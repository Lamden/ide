import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

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

const styles = theme => ({
  root: {
    display: 'flex',
  }
});


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
   // console.log(prevProps.newContract)
   // console.log(this.props.newContract)
   // console.log(this.props.newContract === prevProps.newContract)
    if (this.props.newContract && this.props.newContract !== prevProps.newContract){
    //  console.log(this.props.newContract[0]);
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
        this.props.enqueueSnackbar('Checking contract for errors...', { variant: 'info' });
        API.lint(this.props.ApiInfo, 'testName', this.getEditorValue()).then(data => this.handleErrors(data));
        break;
      case "Submit":
        this.props.enqueueSnackbar('Attempting to submit contract...', { variant: 'info' });
        API.submit_contract(this.props.ApiInfo, 'testName', this.getEditorValue()).then(data => this.handleErrors(data));
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
    
    console.log(errors);
    if (errors === 'null'){
      this.setState({ errors: ['ok'] });
      this.props.enqueueSnackbar('Contract has 0 Errors!', { variant: 'success' });
      return
    }

    if (errors === 'success!'){
      this.setState({ errors: ['success!'] });
      this.props.enqueueSnackbar('Contact Submitted!', { variant: 'success' });
      return
    }

    if (JSON.parse(errors).error === undefined){
      this.setState({ errors: JSON.parse(errors.toString()) });
      this.props.enqueueSnackbar('Errors Found!', { variant: 'error' });
    }else {
      this.setState({ errors: [JSON.parse(errors).error]});
      this.props.enqueueSnackbar('Errors Found!', { variant: 'error' });
    }
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
    const { classes, theme } = this.props
      return (
        <div>
            <EditorContainer width={this.props.width} height={this.props.height} className="monaco-window" />
            <ErrorBox width={this.props.drawerOpen ? this.props.width : this.props.width - 73} height={errorBoxHeight} errors={this.state.errors} />
        </div>
      );
  }
}

MonacoWindow.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(withSnackbar(MonacoWindow));