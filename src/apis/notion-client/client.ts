import { NotionAPI } from "notion-client"

const NOTION_USER_AGENT =
  "Mozilla/5.0 (compatible; Teddistory/1.0; +https://blog.teddy-kim.com)"

export const notionClient = new NotionAPI({
  userTimeZone: "Asia/Seoul",
  ofetchOptions: {
    headers: {
      "user-agent": NOTION_USER_AGENT,
    },
  },
})
