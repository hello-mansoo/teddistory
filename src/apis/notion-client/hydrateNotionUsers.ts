import type {
  ExtendedRecordMap,
  NotionMapBox,
  User,
  UserMap,
} from "notion-types"
import { getBlockValue } from "notion-utils"
import { notionClient } from "./client"

const USER_ID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

type NotionUsersResponse = {
  results?: NotionMapBox<User>[]
  recordMapWithRoles?: {
    notion_user?: UserMap
  }
}

const normalizeUserMap = (userMap: UserMap): UserMap =>
  Object.fromEntries(
    Object.entries(userMap).flatMap(([id, record]) => {
      const user = getBlockValue(record)
      return user ? [[id, { role: "reader" as const, value: user }]] : []
    })
  )

export const fetchNotionUsersById = async (userIds: string[]) => {
  // notion-client 8.0.8's runtime response includes boxed records and
  // recordMapWithRoles, while its public type currently declares bare users.
  const response = (await notionClient.getUsers(
    userIds
  )) as unknown as NotionUsersResponse

  if (response.recordMapWithRoles?.notion_user) {
    return normalizeUserMap(response.recordMapWithRoles.notion_user)
  }

  return normalizeUserMap(
    Object.fromEntries(
      (response.results ?? []).flatMap((record) => {
        const user = getBlockValue(record)
        return user ? [[user.id, record]] : []
      })
    ) as UserMap
  )
}

const collectUserIds = (value: unknown, userIds: Set<string>) => {
  if (Array.isArray(value)) {
    if (
      value[0] === "u" &&
      typeof value[1] === "string" &&
      USER_ID_PATTERN.test(value[1])
    ) {
      userIds.add(value[1])
    }

    value.forEach((item) => {
      collectUserIds(item, userIds)
    })
    return
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => {
      collectUserIds(item, userIds)
    })
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

  const fetchedUsers = await fetchNotionUsersById(missingUserIds)

  recordMap.notion_user = normalizeUserMap({
    ...(recordMap.notion_user ?? {}),
    ...fetchedUsers,
  })

  return recordMap
}
