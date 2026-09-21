import { ExtendedRecordMap } from "notion-types"
import { getBlockValue } from "notion-utils"
import { notionClient } from "./client"

const USER_ID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

const collectUserIds = (value: unknown, userIds: Set<string>) => {
  if (Array.isArray(value)) {
    if (
      value[0] === "u" &&
      typeof value[1] === "string" &&
      USER_ID_PATTERN.test(value[1])
    ) {
      userIds.add(value[1])
    }

    value.forEach((item) => collectUserIds(item, userIds))
    return
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectUserIds(item, userIds))
  }
}

export const hydrateNotionUsers = async (recordMap: ExtendedRecordMap) => {
  const userIds = new Set<string>()

  Object.values(recordMap.block).forEach((record) => {
    collectUserIds(getBlockValue(record)?.properties, userIds)
  })

  const missingUserIds = [...userIds].filter(
    (userId) => !getBlockValue(recordMap.notion_user?.[userId])
  )
  if (!missingUserIds.length) return recordMap

  const response = await notionClient.getUsers(missingUserIds)
  const fetchedUsers = (response as any)?.recordMapWithRoles?.notion_user ?? {}

  recordMap.notion_user = {
    ...(recordMap.notion_user ?? {}),
    ...fetchedUsers,
  }

  return recordMap
}
