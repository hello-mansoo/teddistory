import type { TPosts } from "src/types"

export function getAllSelectItemsFromPosts(
  key: "tags" | "category",
  posts: TPosts
) {
  const selectedPosts = posts.filter((post) => post?.[key])
  const items = [...selectedPosts.flatMap((p) => p[key])]
  const itemObj: { [itemName: string]: number } = {}
  items.forEach((item) => {
    if (!item) return
    if (item in itemObj) {
      itemObj[item]++
    } else {
      itemObj[item] = 1
    }
  })
  return itemObj
}
