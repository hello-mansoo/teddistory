import { TPosts, TPostStatus, TPostType, TPostDraft } from "src/types"
import { CONFIG } from "site.config"

export type FilterPostsOptions = {
  acceptStatus?: TPostStatus[]
  acceptType?: TPostType[]
  acceptDraft?: TPostDraft
}

const initialOption: FilterPostsOptions = {
  acceptStatus: ["Public"],
  acceptType: ["Post"],
  acceptDraft: "No",
}
const current = new Date()
const tomorrow = new Date(current)
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

export function filterPosts(
  posts: TPosts,
  options: FilterPostsOptions = initialOption
) {
  const { acceptStatus = ["Public"], acceptType = ["Post"], acceptDraft = "No" } = options
  const filteredPosts = posts
    // filter data
    .filter((post) => {
      const postDate = new Date(post?.date?.start_date || post.createdTime)
      if (!post.title || !post.slug || postDate > tomorrow) return false
      return true
    })
    // filter status
    .filter((post) => {
      const postStatus = post.status[0]
      return acceptStatus.includes(postStatus)
    })
    // filter type
    .filter((post) => {
      const postType = post.type[0]
      return acceptType.includes(postType)
    })
    // filter draft (Yes 일 경우 개발 블로그에서만 보이도록)
    // Draft는 체크되어 있지 않을 경우 내려오지 않거나 "No"로 내려옴
    .filter((post) => {
      if (!CONFIG.isProd) return true
      return !post.draft || post.draft === acceptDraft
    })
  return filteredPosts
}
