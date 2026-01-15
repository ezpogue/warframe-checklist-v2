// src/pages/index.js
import React from "react";
import ThemeProvider from "../lib/themeProvider.js";
import IndexPageContent from "./indexPageContent.js";

const IndexPage = () => {
  return (
    <ThemeProvider>
      <IndexPageContent />
    </ThemeProvider>
  );
};

export default IndexPage;
