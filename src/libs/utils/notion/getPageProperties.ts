import { getBlockValue, getDateValue, getTextContent } from "notion-utils"
import {
  CollectionPropertySchemaMap,
  ExtendedRecordMap,
  User,
} from "notion-types"
import { notionClient } from "src/apis/notion-client/client"
import { customMapImageUrl } from "./customMapImageUrl"

async function getPageProperties(
  id: string,
  recordMap: ExtendedRecordMap,
  schema: CollectionPropertySchemaMap
) {
  type NotionUser = User & { name?: string }

  const block = getBlockValue(recordMap.block[id])
  if (!block) return null

  const rawProperties = Object.entries(block.properties || [])
  const excludeProperties = ["date", "select", "multi_select", "person", "file"]
  const properties: any = {}
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val]: any = rawProperties[i]
    properties.id = id
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val)
    } else {
      switch (schema[key]?.type) {
        case "file": {
          try {
            const url: string = val[0][1][0][1]
            const newurl = customMapImageUrl(url, block)
            properties[schema[key].name] = newurl
          } catch (error) {
            properties[schema[key].name] = undefined
          }
          break
        }
        case "date": {
          const dateProperty: any = getDateValue(val)
          delete dateProperty.type
          properties[schema[key].name] = dateProperty
          break
        }
        case "select": {
          const selects = getTextContent(val)
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(",")
          }
          break
        }
        case "multi_select": {
          const selects = getTextContent(val)
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(",")
          }
          break
        }
        case "person": {
          const userIds = val.flatMap((decoration: any[]) =>
            (decoration?.[1] ?? [])
              .filter(
                (annotation: unknown[]) =>
                  annotation?.[0] === "u" && typeof annotation?.[1] === "string"
              )
              .map((annotation: unknown[]) => annotation[1] as string)
          )

          const users = await Promise.all(
            userIds.map(async (userId: string) => {
              let user = getBlockValue(recordMap.notion_user?.[userId]) as
                | NotionUser
                | undefined

              if (!user) {
                const res = await notionClient.getUsers([userId])
                user = getBlockValue(
                  (res as any)?.recordMapWithRoles?.notion_user?.[userId]
                ) as NotionUser | undefined
              }

              return {
                id: user?.id,
                name:
                  user?.name ||
                  [user?.family_name, user?.given_name]
                    .filter(Boolean)
                    .join(" ") ||
                  undefined,
                profile_photo: user?.profile_photo || null,
              }
            })
          )
          properties[schema[key].name] = users
          break
        }
        default:
          break
      }
    }
  }
  return properties
}

export { getPageProperties as default }
