require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  pathPrefix: "/warframe-checklist",
  siteMetadata: {
    title: `Warframe Checklist`,
    description: `Basic checklist for warframe items`,
    author: `Ezekiel Pogue`,
    siteUrl: `https://ezpogue.github.io/warframe-checklist`,
  },
  plugins: [
    "gatsby-plugin-postcss",
  ],
}