import { useRouter } from "next/router"
import { useMemo } from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import PostCard from "src/routes/Feed/PostList/PostCard"
import type { TPosts } from "src/types"

type Props = {
  posts: TPosts
  q: string
}

const PostList = ({ posts, q }: Props) => {
  const router = useRouter()

  const currentTag = `${router.query.tag || ``}` || undefined
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ``}` || "desc"

  const filteredPosts = useMemo(() => {
    let newFilteredPosts = posts
    // keyword
    newFilteredPosts = newFilteredPosts.filter((post) => {
      const tagContent = post.tags ? post.tags.join(" ") : ""
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(q.toLowerCase())
    })

    // tag
    if (currentTag) {
      newFilteredPosts = newFilteredPosts.filter((post) =>
        post?.tags?.includes(currentTag)
      )
    }

    // category
    if (currentCategory !== DEFAULT_CATEGORY) {
      newFilteredPosts = newFilteredPosts.filter((post) =>
        post?.category?.includes(currentCategory)
      )
    }
    // order
    if (currentOrder !== "desc") {
      newFilteredPosts = newFilteredPosts.reverse()
    }

    return newFilteredPosts
  }, [posts, q, currentTag, currentCategory, currentOrder])

  return (
    <div className="my-2">
      {!filteredPosts.length && (
        <p className="text-gray-500 dark:text-gray-300">Nothing! 😺</p>
      )}
      {filteredPosts.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </div>
  )
}

export default PostList
