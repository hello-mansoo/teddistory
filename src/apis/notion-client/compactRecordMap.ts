import type {
  Block,
  Collection,
  CollectionView,
  ExtendedRecordMap,
  NotionMapBox,
  User,
} from "notion-types"
import { getBlockCollectionId, getBlockValue } from "notion-utils"

type RecordValue = Block | Collection | CollectionView | User
type UnknownRecord = Record<string, unknown>

const FILE_BLOCK_TYPES = new Set<Block["type"]>([
  "audio",
  "drive",
  "file",
  "pdf",
  "video",
])

const removeSyncMetadata = (block: Block) => {
  const compactBlock = block as unknown as UnknownRecord

  // These fields are used by Notion's editor and sync engine, not by
  // react-notion-x. crdt_data alone accounts for roughly half of large pages.
  delete compactBlock.crdt_data
  delete compactBlock.crdt_format_version
  delete compactBlock.copied_from
  delete compactBlock.space_id
  delete compactBlock.version

  // Page timestamps may be rendered by collection properties. Content block
  // timestamps are editor metadata and are never displayed by the renderer.
  if (block.type !== "page" && block.type !== "collection_view_page") {
    delete compactBlock.created_time
    delete compactBlock.last_edited_time
  }
}

const toSingleBox = <T extends RecordValue>(
  record: NotionMapBox<T> | undefined
): NotionMapBox<T> | undefined => {
  const value = getBlockValue(record)
  return value ? { role: "reader", value } : undefined
}

const collectStrings = (value: unknown, strings: Set<string>) => {
  if (typeof value === "string") {
    strings.add(value)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      collectStrings(item, strings)
    })
    return
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => {
      collectStrings(item, strings)
    })
  }
}

const collectQueryBlockIds = (
  value: unknown,
  visitBlock: (blockId: string) => void
) => {
  if (Array.isArray(value)) {
    value.forEach((item) => {
      collectQueryBlockIds(item, visitBlock)
    })
    return
  }

  if (!value || typeof value !== "object") return

  for (const [key, item] of Object.entries(value)) {
    if (key === "blockIds" && Array.isArray(item)) {
      item.forEach((blockId) => {
        if (typeof blockId === "string") visitBlock(blockId)
      })
    } else {
      collectQueryBlockIds(item, visitBlock)
    }
  }
}

/**
 * Removes Notion editor/sync data before a record map is serialized into
 * Next.js page props. The returned map still contains every block reachable
 * from the page, embedded collection data, user mentions, and signed URLs for
 * downloadable media.
 */
export const compactRecordMap = (
  recordMap: ExtendedRecordMap,
  pageId: string
) => {
  const reachableBlockIds = new Set<string>()
  const collectionIds = new Set<string>()
  const collectionViewIds = new Set<string>()

  const visitBlock = (blockId: string) => {
    if (reachableBlockIds.has(blockId)) return

    const block = getBlockValue(recordMap.block[blockId])
    if (!block) return
    reachableBlockIds.add(blockId)

    block.content?.forEach(visitBlock)

    if (block.type === "transclusion_reference") {
      visitBlock(block.format.transclusion_reference_pointer.id)
    }

    if (
      block.type === "collection_view" ||
      block.type === "collection_view_page" ||
      block.type === "table"
    ) {
      const collectionId = getBlockCollectionId(block, recordMap)
      if (!collectionId) return

      collectionIds.add(collectionId)
      block.view_ids?.forEach((viewId) => {
        collectionViewIds.add(viewId)
        collectQueryBlockIds(
          recordMap.collection_query[collectionId]?.[viewId],
          visitBlock
        )
      })
    }
  }

  visitBlock(pageId)

  const fileAssetKeys = new Set<string>()
  const compactBlocks = Object.fromEntries(
    Object.entries(recordMap.block).flatMap(([blockId, record]) => {
      if (!reachableBlockIds.has(blockId)) return []

      const block = getBlockValue(record)
      if (!block) return []

      // The application renders database properties in PostHeader. Treat the
      // root as a regular content page so react-notion-x does not serialize and
      // render the hidden parent database a second time.
      if (blockId === pageId && block.parent_table === "collection") {
        block.parent_table = "block"
      }

      if (FILE_BLOCK_TYPES.has(block.type)) {
        fileAssetKeys.add(blockId)
        collectStrings(block.properties, fileAssetKeys)
        collectStrings(block.format, fileAssetKeys)
      }

      removeSyncMetadata(block)
      return [[blockId, { role: "reader" as const, value: block }]]
    })
  )

  const compactMap = <T extends RecordValue>(
    map: Record<string, NotionMapBox<T>>,
    retainedIds?: Set<string>
  ) =>
    Object.fromEntries(
      Object.entries(map).flatMap(([id, record]) => {
        if (retainedIds && !retainedIds.has(id)) return []
        const compactRecord = toSingleBox(record)
        return compactRecord ? [[id, compactRecord]] : []
      })
    )

  recordMap.block = compactBlocks
  recordMap.collection = compactMap(recordMap.collection, collectionIds)
  recordMap.collection_view = compactMap(
    recordMap.collection_view,
    collectionViewIds
  )
  recordMap.collection_query = Object.fromEntries(
    Object.entries(recordMap.collection_query).flatMap(
      ([collectionId, queries]) =>
        collectionIds.has(collectionId) ? [[collectionId, queries]] : []
    )
  )
  recordMap.notion_user = compactMap(recordMap.notion_user)
  recordMap.signed_urls = Object.fromEntries(
    Object.entries(recordMap.signed_urls ?? {}).filter(([key]) =>
      fileAssetKeys.has(key)
    )
  )

  return recordMap
}
