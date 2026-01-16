import React from "react";
import ThemeProvider from "./src/lib/themeProvider";

export const wrapRootElement = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>;
};
