import React from "react"
import PropTypes from "prop-types"

//import MainMenu from './mainmenu';
import PageFramework from "../components/pageframework"
import { SnackbarProvider, withSnackbar} from 'notistack';



const MainLayout = ({ children }) => {
  return (
    <SnackbarProvider>
      <PageFramework />
    </SnackbarProvider>
    )
}


MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MainLayout;
