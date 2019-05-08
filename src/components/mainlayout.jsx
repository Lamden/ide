import React from "react"
import PropTypes from "prop-types"

//import MainMenu from './mainmenu';
import PageFramework from "../components/pageframework"

const MainLayout = ({ children }) => {
  return (
    <div>
      <PageFramework />
    </div>
    )

}


MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MainLayout
