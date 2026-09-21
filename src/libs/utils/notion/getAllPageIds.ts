import type { ExtendedRecordMap, ID } from "notion-types"
import { idToUuid } from "notion-utils"

export default function getAllPageIds(
  response: ExtendedRecordMap,
  viewId?: string
) {
  const collections = Object.values(response.collection_query ?? {})

  let pageIds: ID[] = []
  if (viewId) {
    const vId = idToUuid(viewId)
    for (const views of collections) {
      const view = views[vId]
      if (view) {
        pageIds = [
          ...(view.blockIds ?? []),
          ...(view.collection_group_results?.blockIds ?? []),
        ]
        break
      }
    }
  } else {
    const pageSet = new Set<ID>()
    collections.forEach((views) => {
      Object.values(views).forEach((view) => {
        view?.blockIds?.forEach((id) => {
          pageSet.add(id)
        })
        view?.collection_group_results?.blockIds?.forEach((id) => {
          pageSet.add(id)
        })
      })
    })
    pageIds = [...pageSet]
  }
  return [...new Set(pageIds)]
}
