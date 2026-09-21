import type { GetStaticProps } from "next"
import MetaConfig from "src/components/MetaConfig"
import { filterPosts } from "src/libs/utils/notion"
import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { getPosts } from "../apis"
import type { NextPageWithLayout, TPosts } from "../types"

type Props = {
  posts: TPosts
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = filterPosts(await getPosts())

  return {
    props: {
      posts,
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const FeedPage: NextPageWithLayout<Props> = ({ posts }) => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
    image: CONFIG.ogImageGenerateURL,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Feed posts={posts} />
    </>
  )
}

export default FeedPage
