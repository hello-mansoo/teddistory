import { getBlockValue } from "notion-utils"
import { notionClient } from "./client"
import { hydrateNotionUsers } from "./hydrateNotionUsers"

export const getRecordMap = async (pageId: string) => {
  const recordMap = await notionClient.getPage(pageId)
  await hydrateNotionUsers(recordMap)

  // The blog renders database properties in its own post header. Prevent the
  // hidden duplicate from react-notion-x; its person property is not
  // hydration-stable between server and client in the current upstream build.
  const page = getBlockValue(recordMap.block[pageId])
  if (page?.parent_table === "collection") {
    const collection = getBlockValue(recordMap.collection[page.parent_id])
    if (collection) {
      recordMap.collection[page.parent_id] = {
        role: "reader",
        value: {
          ...collection,
          format: {
            ...collection.format,
            property_visibility: Object.keys(collection.schema).map(
              (property) => ({ property, visibility: "hide" as const })
            ),
          },
        },
      }
    }
  }

  return recordMap
}
