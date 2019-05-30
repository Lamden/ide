/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import Select from 'react-select';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { Typography, NoSsr, TextField, Paper, Button, Chip, MenuItem } from '@material-ui/core';

import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import * as API from '../../js/contracting_api';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginLeft: '10px'
  },
  input: {
    display: 'flex',
    padding: 15,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 20,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 20,
    paddingLeft: '5px',
    color: '#aaaaaa'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  button: {
    margin: '10px'
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class ContractSearch extends React.Component {
    state = {
        single: null,
        multi: null,
        contracts: [],
        apiStatus: 'Offline'
    };


    componentDidUpdate(){
      if (this.props.apiStatus !== this.state.apiStatus){
          if (this.props.apiStatus === 'Online'){
            API.contracts()
              .then(data => data.contracts.map(contract => ({label: contract, value: contract})))
              .then(contracts => this.setState({contracts, apiStatus: 'Online'}));
          }
          if (this.props.apiStatus === 'Offline'){
            this.setState({contracts: [], apiStatus: 'Offline'})
          }
        }
      }

    handleChange = () => value => {
        this.setState({
            single: value,
        }, () => {
            if (this.state.single){
                this.props.getMeta(this.state.single.value);
            }else{
              this.props.getMeta();
            }
        }); 
    };

    openCode = () => {
      API.contract(this.state.single.value)
        .then(data => this.props.openCode(data.name, data.code, 'database'))
        .catch(e => console.log(e));
    }

  render() {
    const { classes, theme } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
        
      <div className={classes.root}>
        <NoSsr>
          <Select
            onSubmit={this.handleChange()}
            classes={classes}
            styles={selectStyles}
            options={this.state.contracts}
            components={components}
            value={this.state.single}
            onChange={this.handleChange()}
            placeholder = {this.state.apiStatus === 'Online' ? "Contracts DB" : 'API Offline'}
            isClearable
          />
          {this.state.single ?
            <div>
              <Button className={classes.button} size="medium" onClick={() => this.openCode()}>Open Code</Button>
            </div>
          : null
          }

        </NoSsr>
      </div>
    );
  }
}

ContractSearch.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ContractSearch);