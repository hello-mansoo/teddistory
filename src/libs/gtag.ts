import { CONFIG } from "site.config"
export const GA_TRACKING_ID = CONFIG.googleAnalytics.config.measurementId

type AnalyticsFunction = (
  command: "config" | "event",
  target: string,
  parameters: Record<string, string | number>
) => void

const getAnalytics = () =>
  (globalThis as typeof globalThis & { gtag?: AnalyticsFunction }).gtag

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  const analytics = getAnalytics()
  if (typeof window !== "object" || !analytics) return
  analytics("config", GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label: string
  value: number
}) => {
  const analytics = getAnalytics()
  if (typeof window !== "object" || !analytics) return
  analytics("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
