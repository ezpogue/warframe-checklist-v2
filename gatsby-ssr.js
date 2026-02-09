import React from "react";
import ThemeProvider from "./src/lib/themeProvider";

const themeInitScript = `
(function () {
  try {
    var theme = localStorage.getItem("theme") || "classic";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    // Ignore errors during SSR or if localStorage is blocked.
  }
})();
`;

export const wrapRootElement = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>;
};

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="theme-init"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />,
  ]);
};
