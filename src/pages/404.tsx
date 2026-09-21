import MetaConfig from "src/components/MetaConfig"
import { CONFIG } from "../../site.config"
import CustomError from "../routes/Error"
import type { NextPageWithLayout, TPosts, TTags } from "../types"

type Props = {
  tags: TTags
  posts: TPosts
}

const NotFoundPage: NextPageWithLayout<Props> = () => {
  return <CustomError />
}

NotFoundPage.getLayout = (page) => {
  return (
    <>
      <MetaConfig
        {...{
          title: CONFIG.blog.title,
          description: CONFIG.blog.description,
          type: "website",
          url: CONFIG.link,
        }}
      />
      {page}
    </>
  )
}

export default NotFoundPage
