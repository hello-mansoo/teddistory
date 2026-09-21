import { notionClient } from "./client"
import { hydrateNotionUsers } from "./hydrateNotionUsers"

export const getRecordMap = async (pageId: string) => {
  const recordMap = await notionClient.getPage(pageId)
  return hydrateNotionUsers(recordMap)
}
