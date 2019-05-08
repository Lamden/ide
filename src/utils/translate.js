import React from 'react';

import MainNavBar from '../locales/en/MainNavBar';
import Header from '../locales/en/Header';
import Comparisons from '../locales/en/Comparisons';
import CompsChart from '../locales/en/CompsChart';
import WhatIsZest from '../locales/en/WhatIsZest';
import IeoDetails from '../locales/en/IeoDetails';
import IeoProgress from '../locales/en/IeoProgress';
import Funds from '../locales/en/Funds';
import Team from '../locales/en/Team';
import Advisors from '../locales/en/Advisors';
import News from '../locales/en/News';
import Footer from '../locales/en/Footer';

const nameSpacesMap = {
  mainnavbar: MainNavBar,
  header: Header,
  comparisons: Comparisons,
  compschart: CompsChart,
  whatiszest: WhatIsZest,
  ieodetails: IeoDetails,
  ieoprogress: IeoProgress,
  funds: Funds,
  team: Team,
  advisors: Advisors,
  news: News,
  footer: Footer
};

const translate = nameSpace => WrappedComponent => (
  class Translator extends React.Component {
    constructor(props) {
      super(props);
      this.nameSpace = nameSpace.toLowerCase();
    }

    t = (key) => {
      if (nameSpacesMap[this.nameSpace] && nameSpacesMap[this.nameSpace][key]) {
        return nameSpacesMap[this.nameSpace][key];
      }
      return key;
    }

    render() {
      return <WrappedComponent t={this.t} {...this.props} />;
    }
  }
);

export default translate;
