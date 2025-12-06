exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
      watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
      },
    })
  }

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  if (page.path === "/") {
    const oldPage = { ...page };
    page.matchPath = "/*";
    deletePage(oldPage);
    createPage(page);
  }
};