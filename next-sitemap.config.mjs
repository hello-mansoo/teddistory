import siteConfig from "./site.config.js"

const { CONFIG } = siteConfig

export default {
  siteUrl: CONFIG.link,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: true,
  exclude: ["/resume.html"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/resume.html",
      },
    ],
  },
}
