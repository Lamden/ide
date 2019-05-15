import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

import * as API from '../js/contracting_api.ts';
import ErrorBox from "../components/errorbox";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}



const errorBoxHeight = 150;
const appBarHeight = 100;
const tabsHeight = 37;

const EditorContainer = (props) => {
  return <div
          style={{
            width: props.width ? props.width : '500px', 
            height: props.height ? props.height - (errorBoxHeight + appBarHeight + tabsHeight): '500px',
            borderTop: '2px solid #45387F', paddingTop: '10px'}}
          id="editor-container"></div>
};

const styles = theme => ({
  root: {
    height: tabsHeight + 'px',
    marginTop: '4.25rem'
  },
  tabs: {
    height: tabsHeight + 'px',
    backgroundColor: 'white',
    borderWidth: '2px 2px 0px 2px',
    borderRadius: '10px 10px 0 0',
    borderStyle: 'solid',
    borderColor: '#45387F',
    margin: '0 2px',
    padding: '0 12px',
    '&:focus': {outline:'0'}
  },
  tabSelected: {
    backgroundColor: '#E4ECF0'
  },
  tabUnselected: {
    backgroundColor: 'white'
  }
});


class MonacoWindow extends Component {
  constructor(props) { 
      super(props);
      this.clickController = this.clickController.bind(this);
      this.state = {
        errors: '',
        models: new Map(),
        currentTab: {},
      }
      this.editor = null; 
      this.monaco = null;
  }

  componentDidMount() {
    import("monaco-editor")
      .then( monaco => {
        this.monaco = monaco;
        this.editor = this.monaco.editor.create(document.getElementById("editor-container"), {automaticLayout: true});
        
        const files = cookies.getAll();
        console.log(files);
        
        if (!files['openfiles']){
          this.createNewFile('# Welcome to the blockchain revolution', 'new contract');
        }else{
          this.openCookieFiles(files['openfiles'])
        }

        this.props.setClick(this.clickController);

      })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (this.props.newContract && this.props.newContract !== prevProps.newContract){
      
      API.contract(this.props.ApiInfo, this.props.newContract[0])
        .then(data => this.createNewFile(data.toString(), this.props.newContract[0]))
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
        API.contract('submission').then(data => this.createNewFile(data.toString()));
        break;
      case "Lint":
        this.props.enqueueSnackbar('Checking contract for errors...', { variant: 'info' });
        API.lint(this.props.ApiInfo, 'testName', this.getEditorValue()).then(data => this.handleErrors(data));
        break;
      case "Submit":
        this.props.enqueueSnackbar('Attempting to submit contract...', { variant: 'info' });
        try{
          API.submit_contract(this.props.ApiInfo, 'testName', this.getEditorValue()).then(data => this.handleErrors(data));
        } catch (e) {
          this.props.enqueueSnackbar(e.message, { variant: 'error' });
        }
        
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
    this.createNewFile(value);
    //this.editor.setValue(value);
  }

  createNewFile = (value, name) => {
    let models = this.state.models;
    if (!models.has(name)){
      const newFile = this.monaco.editor.createModel(value, 'python');
      this.editor.setModel(newFile);
      models.set(name, newFile);
      this.setState({ models, currentTab: {name, id: newFile.id}})
    }else{     
      this.handleFileSwitching(name);
    }
  }

  handleFileSwitching = (name) => {
    const model = this.state.models.get(name);
    this.editor.setModel(model);
    this.setState({currentTab: {name, id: model.id}})
  }

  openCookieFiles = async (openfiles) => {
    let models = this.state.models;
    console.log(openfiles)
    await asyncForEach( openfiles, async (filename) => {
      await waitFor(50);
      console.log('opening: ' + filename)
      API.contract(this.props.ApiInfo, filename)
      .then(data => this.createTab(data.toString()))
      .then(model => models.set(filename, model));
    });
    
    this.setState({ models }, () => {
      this.handleFileSwitching(openfiles[0])
    })
  }

  createTab = (value) => {
    const newTab = this.monaco.editor.createModel(value, 'python');
    this.editor.setModel(newTab);
    return newTab
  }

  handleErrors = (errors) => {
    try{
      const test = JSON.parse(errors);
    } catch (e) {
      this.props.enqueueSnackbar('Error: Unexpected API Result', { variant: 'error' });
      this.setState({ errors: [e.message] });
      return
    }

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

  isTabSeleted = (model) => {
    if (this.state.currentTab.id === model.id) {return true}
    return false
  }

  render() {
    const { classes, theme } = this.props

    const buttons = []

    for (const [index, value] of this.state.models.entries()) {
      console.log('creating button: ' + index)
      buttons.push(<button 
                      onClick={() =>  this.handleFileSwitching(index)} 
                      className={classNames(classes.tabs, {
                                            [classes.tabSelected]: this.isTabSeleted(value),
                                            [classes.tabUnselected]: !this.isTabSeleted(value)})} key={index}>
                        {index}
                    </button>)
    }
      return (
        <div className={classNames(classes.root)}>
            <div>
              {buttons}
            </div>
            <EditorContainer width={this.props.drawerOpen ? this.props.width : this.props.width - 73} height={this.props.height} className="monaco-window" />
            <ErrorBox width={this.props.drawerOpen ? this.props.width - 12 : this.props.width - 85} height={errorBoxHeight} errors={this.state.errors} />
        </div>
      );
  }
}

MonacoWindow.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(withSnackbar(MonacoWindow));