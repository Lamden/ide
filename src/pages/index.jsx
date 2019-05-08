import React from "react"

import MainLayout from "../components/mainlayout"
import SEO from "../components/seo"

// Import Styling
import '../styles/main.scss';

const IndexPage = () => (
  <MainLayout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
  </MainLayout>
)

export default IndexPage
