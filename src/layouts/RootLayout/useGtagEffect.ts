import { useRouter } from "next/router"
import { useEffect } from "react"
import { CONFIG } from "site.config"
import * as gtag from "src/libs/gtag"

const useGtagEffect = () => {
  const router = useRouter()
  useEffect(() => {
    if (!(CONFIG.isProd && CONFIG?.googleAnalytics?.enable)) return

    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])
  return null
}
export default useGtagEffect
