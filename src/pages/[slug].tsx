import type { GetStaticPaths, GetStaticProps } from "next"
import { CONFIG } from "site.config"
import { getPosts, getRecordMap } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { filterPosts } from "src/libs/utils/notion"
import type { FilterPostsOptions } from "src/libs/utils/notion/filterPosts"
import Detail from "src/routes/Detail"
import type { NextPageWithLayout, PostDetail } from "../types"

const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

type Params = {
  slug: string
}

type Props = {
  post: PostDetail
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = await getPosts()
  const filteredPost = filterPosts(posts, filter)

  return {
    paths: filteredPost.map((row) => `/${row.slug}`),
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const slug = context.params?.slug

  const posts = await getPosts()
  const detailPosts = filterPosts(posts, filter)
  const postDetail = detailPosts.find((post) => post.slug === slug)

  if (!postDetail) {
    return {
      notFound: true,
    }
  }

  // Fetch recordMap for the detail page
  const recordMap = await getRecordMap(postDetail.id)

  return {
    props: {
      post: {
        ...postDetail,
        recordMap,
      },
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const DetailPage: NextPageWithLayout<Props> = ({ post }) => {
  const image =
    post.thumbnail ??
    CONFIG.ogImageGenerateURL ??
    `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(post.title)}.png`

  const date = post.date?.start_date || post.createdTime || ""

  const meta = {
    title: post.title,
    date: new Date(date).toISOString(),
    image: image,
    description: post.summary || "",
    type: post.type[0],
    url: `${CONFIG.link}/${post.slug}`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Detail data={post} />
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
