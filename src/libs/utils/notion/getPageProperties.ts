import type {
  CollectionPropertySchemaMap,
  Decoration,
  ExtendedRecordMap,
  User,
} from "notion-types"
import { getBlockValue, getDateValue, getTextContent } from "notion-utils"
import { fetchNotionUsersById } from "src/apis/notion-client/hydrateNotionUsers"
import { customMapImageUrl } from "./customMapImageUrl"

const getNotionFileUrl = (value: unknown): string | undefined => {
  if (!Array.isArray(value)) return undefined

  const url = value[0]?.[1]?.[0]?.[1]
  return typeof url === "string" ? url : undefined
}

const getNotionUserIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []

  return value.flatMap((decoration) => {
    if (!Array.isArray(decoration) || !Array.isArray(decoration[1])) return []

    return decoration[1].flatMap((annotation) =>
      Array.isArray(annotation) &&
      annotation[0] === "u" &&
      typeof annotation[1] === "string"
        ? [annotation[1]]
        : []
    )
  })
}

async function getPageProperties(
  id: string,
  recordMap: ExtendedRecordMap,
  schema: CollectionPropertySchemaMap
) {
  type NotionUser = User & { name?: string }

  const block = getBlockValue(recordMap.block[id])
  if (!block) return null

  const rawProperties = Object.entries(
    (block.properties ?? {}) as Record<string, Decoration[]>
  )
  const excludeProperties = ["date", "select", "multi_select", "person", "file"]
  const properties: Record<string, unknown> = {}
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i]
    properties.id = id
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val)
    } else {
      switch (schema[key]?.type) {
        case "file": {
          const url = getNotionFileUrl(val)
          if (url) {
            const newurl = customMapImageUrl(url, block)
            properties[schema[key].name] = newurl
          } else {
            properties[schema[key].name] = undefined
          }
          break
        }
        case "date": {
          const dateProperty = getDateValue(val)
          if (dateProperty) {
            const { type: _type, ...date } = dateProperty
            properties[schema[key].name] = date
          }
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
          const userIds = getNotionUserIds(val)

          const users = await Promise.all(
            userIds.map(async (userId: string) => {
              let user = getBlockValue(recordMap.notion_user?.[userId]) as
                | NotionUser
                | undefined

              if (!user) {
                const usersById = await fetchNotionUsersById([userId])
                user = getBlockValue(usersById[userId]) as
                  | NotionUser
                  | undefined
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
