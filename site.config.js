const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Mansoo Kim",
    image: "/profile.jpg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Software Engineer, AI Agent",
    subRole: "(ex-Developer Advocate)",
    bio: "Everyday Happy Coding",
    email: "contact@teddy-kim.com",
    linkedin: "mansoo-teddy-kim",
    github: "hello-mansoo",
    instagram: "man_s000",
  },
  // projects: [
  //   {
  //     name: `teddistory`,
  //     href: "https://github.com/TwoShot22/teddistory",
  //   },
  // ],
  projects: undefined,
  // blog setting (required)
  blog: {
    title: "Teddistory | 김테디의 기술 블로그",
    header: isProd() ? "<Teddistory />" : "<Teddistory dev />",
    description:
      "개발부터 DevRel, 일상 이야기까지 때로는 기술적으로, 때로는 감성적으로 김테디의 모든 순간을 기록하고 아카이빙합니다",
  },

  // CONFIG configration (required)
  link: isProd()
    ? "https://blog.teddy-kim.com"
    : "https://dev-blog.teddy-kim.com",
  since: 2023, // If leave this empty, current year will be used.
  lang: "ko-KR", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "/og_image.png", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: true,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: true,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: true,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  jenniferFront: {
    enable: true,
    config: {
      id: process.env.NEXT_PUBLIC_JENNIFER_FRONT_ID || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  isProd: isProd(), // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 21600 * 7, // revalidate time for [slug], index
}

module.exports = { CONFIG }

function isProd() {
  return process.env.NEXT_PUBLIC_RUN_MODE === "Production"
}
