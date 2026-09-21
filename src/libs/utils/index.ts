export function formatDate(date: string | number, local: Intl.LocalesArgument) {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
  const res = d.toLocaleDateString(local, options)
  return res
}
