import { RootLayout } from "src/layouts"
import type { AppPropsWithLayout } from "../types"

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  return <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
}

export default App
