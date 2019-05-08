import React from "react"

import MainLayout from "../components/mainlayout"
import SEO from "../components/seo"
import MonacoWindow from "../components/monacowindow"

// Import Styling
import '../styles/main.scss';

const IndexPage = () => (
  <MainLayout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <MonacoWindow />
  </MainLayout>
)

export default IndexPage
