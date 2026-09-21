import { CONFIG } from "site.config"
import { getBlockValue, parsePageId } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPost, TPosts } from "src/types"
import { notionClient } from "./client"
import { hydrateNotionUsers } from "./hydrateNotionUsers"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  const configuredPageId = CONFIG.notionConfig.pageId
  if (!configuredPageId) {
    throw new Error("NOTION_PAGE_ID is required")
  }

  const id = parsePageId(configuredPageId)
  if (!id) {
    throw new Error("NOTION_PAGE_ID is not a valid Notion page ID or URL")
  }

  const response = await notionClient.getPage(configuredPageId, {
    throwOnCollectionErrors: true,
  })
  await hydrateNotionUsers(response)
  const collection = getBlockValue(Object.values(response.collection)[0])
  const schema = collection?.schema
  const rawMetadata = getBlockValue(response.block[id])

  // Check Type
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    throw new Error(
      `NOTION_PAGE_ID must point to a public Notion database (received ${
        rawMetadata?.type ?? "no root block"
      })`
    )
  }

  if (!schema) {
    throw new Error("The configured Notion database schema could not be loaded")
  }

  // Construct Data
  const pageIds = getAllPageIds(response)
  const data = await Promise.all(
    pageIds.map(async (pageId) => {
      const block = getBlockValue(response.block[pageId])
      if (!block) return null

      const properties = await getPageProperties(pageId, response, schema)
      if (!properties) return null

      // Add fullwidth, createdtime to properties
      properties.createdTime = new Date(block.created_time).toString()
      properties.fullWidth =
        (block.format as { page_full_width?: boolean } | undefined)
          ?.page_full_width ?? false

      return properties as TPost
    })
  )

  const posts = data.filter((post): post is TPost => post !== null)

  // Sort by date
  posts.sort((a, b) => {
    const dateA = new Date(a.date?.start_date || a.createdTime).getTime()
    const dateB = new Date(b.date?.start_date || b.createdTime).getTime()
    return dateB - dateA
  })

  return posts as TPosts
}
