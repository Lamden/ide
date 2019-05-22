import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0,0,0,.125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: 'auto',
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,.03)',
    borderBottom: '1px solid rgba(0,0,0,.125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
}))(MuiExpansionPanelDetails);

const styles = {
  fullList: {
    width: 'auto',
  },
};

class Settings extends React.Component {
  constructor(props) { 
    super(props);
      this.state = {
        open: false,
        expanded: "panel1"
      };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  toggleDrawer = () =>{
    console.log('calling')
    this.setState({
      open: !this.state.open,
    });
  }


  handleChange = panel => (event, expanded) => {
    this.setState(
      {
        expanded: expanded ? panel : false
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    const fullList = (
      <div className={classes.fullList}>
        <ExpansionPanel
          square
          expanded={expanded === 'panel1'}
          onChange={this.handleChange('panel1')}
        >
          <ExpansionPanelSummary>
            <Typography>API Server</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus
              ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          square
          expanded={expanded === 'panel2'}
          onChange={this.handleChange('panel2')}
        >
          <ExpansionPanelSummary>
            <Typography>Something Else</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );

    return (
      <div>
        <SwipeableDrawer
          ref={(ref) => { this.ref = ref }}
          anchor="top"
          open={this.state.open}
          onClose={() => this.toggleDrawer()}
          onOpen={() => this.toggleDrawer()}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.toggleDrawer()}
            onKeyDown={() => this.toggleDrawer()}
          >
            {fullList}
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
