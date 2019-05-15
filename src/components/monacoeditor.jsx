import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import { Close, FiberNewOutlined } from '@material-ui/icons';

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
    display: 'inline',
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
  tabButton: {
    backgroundColor: 'transparent',
    border: '0',
    '&:focus': {outline:'1px'}
  },
  tabSelected: {
    backgroundColor: '#E4ECF0',
    fontWeight: 'bold',
  },
  tabClose: {
    height: '16px',
    position: 'relative',
    top: '3px',
    left: '8px',
    border: '1px solid grey',
    borderRadius: '50%',
    width: '16px',
  },
  newTab:{
    position: 'relative',
    top: '6px',
    width: '43px',
    padding: '0',
    margin: '-12px 0',
    fontSize: '269%'
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
        startingWords: '# Welcome to the blockchain revolution',
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
        //cookies.remove('openfiles');
        if (!files['openfiles']){
          this.createNewFile(this.state.startingWords, 'new contract');
        }else{
          this.createNewFile(this.state.startingWords, 'new contract');
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
    if (model){
      this.editor.setModel(model);
      this.setState({currentTab: {name, id: model['id']}})
    }

  }

  openCookieFiles = async (openfiles) => {
    let models = this.state.models;
    openfiles.forEach(filename => {
      API.contract(this.props.ApiInfo, filename)
      .then(data => this.createTab(data.toString()))
      .then(model => this.setState({ models: this.state.models.set(filename, model) }));
    });
  }

  createTab = (value) => {
    const newTab = this.monaco.editor.createModel(value, 'python');
    this.editor.setModel(newTab);
    return newTab
  }

  newTab = () => {
    const tabNames = Array.from( this.state.models.keys() );
    let newNum = 0;
    for (let i; i < tabNames.length; i++){
      if (tabNames[i].includes('new contract')){
        newNum = newNum + 1
      }
    }
    newNum === 0 ? newNum = '' : newNum = newNum.toString()
    this.createNewFile(this.state.startingWords, 'new contract' + newNum)
  }

  closeTab = (name) => {
    let models = this.state.models;
    models.delete(name)
    this.setState({ models }, () => {
      var openFiles = cookies.get('openfiles');
      openFiles.splice(openFiles.indexOf(name))
      cookies.set('openfiles', openFiles);
      
      const tabNames = Array.from( this.state.models.keys() );
      if (tabNames.length > 0){
        this.handleFileSwitching(tabNames[0])
      }else{
        this.createNewFile('# Welcome to the blockchain revolution', 'new contract');
      }
    })
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

    const tabs = []

    for (const [index, value] of this.state.models.entries()) {
      tabs.push(
                  <div className={classNames(classes.tabs, {
                        [classes.tabSelected]: this.isTabSeleted(value),
                        [classes.tabUnselected]: !this.isTabSeleted(value)})} key={index}>
                    <button className={classNames(classes.tabButton)}
                            onClick={() =>  this.handleFileSwitching(index)}> {index} </button>
                    <Close className={classNames(classes.tabClose)} 
                           onClick={() =>  this.closeTab(index)}/>
                  </div>  
                  )
    }
      return (
        <div className={classNames(classes.root)}>
            <span>
                <FiberNewOutlined onClick={() =>  this.newTab()} className={classNames(classes.newTab)} />
            </span>
            <span>
              {tabs}
            </span>
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