import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const pageDirectory = path.join(process.cwd(), ".next", "server", "pages")
const maximumBytes = 128 * 1024
const pageFiles = (await readdir(pageDirectory)).filter(
  (file) =>
    file.endsWith(".json") &&
    !file.endsWith(".nft.json") &&
    !file.includes("manifest")
)

const pages = await Promise.all(
  pageFiles.map(async (file) => {
    const contents = await readFile(path.join(pageDirectory, file), "utf8")
    return { file, bytes: Buffer.byteLength(contents) }
  })
)
const oversizedPages = pages.filter(({ bytes }) => bytes > maximumBytes)
const largestPage = pages.sort((a, b) => b.bytes - a.bytes)[0]

if (oversizedPages.length) {
  for (const { file, bytes } of oversizedPages) {
    console.error(
      `${file}: ${(bytes / 1024).toFixed(1)} KiB exceeds the 128 KiB page-data budget`
    )
  }
  process.exit(1)
}

if (largestPage) {
  console.log(
    `Page-data budget passed (largest: ${largestPage.file}, ${(largestPage.bytes / 1024).toFixed(1)} KiB)`
  )
}
