import React from "react"
import PropTypes from "prop-types"

import MainMenu from './mainmenu';

const MainLayout = ({ children }) => {
  return (
    <div>
      <MainMenu />
      <div className="main-container">
        <main>{children}</main>
        <footer></footer>
      </div>

    </div>
    )

}


MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MainLayout
