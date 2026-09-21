import { expect, test } from "@playwright/test"

const visiblePostSlugs = [
  "review-2023",
  "devocean-tech-day",
  "junior-developer-career",
  "improve-code-review",
  "infcon-2023",
  "resume",
  "first-post",
]

const detailSlugs = [
  "archive",
  "devocean-tech-day",
  "first-post",
  "getting-to-know-aws-ec2",
  "improve-code-review",
  "infcon-2023",
  "inflearn-open-event",
  "junior-developer-career",
  "resume",
  "review-2023",
]

test("홈 피드의 게시글, 검색, 테마가 기존처럼 동작한다", async ({ page }) => {
  const pageErrors: Error[] = []
  page.on("pageerror", (error) => pageErrors.push(error))

  await page.goto("/")
  await expect(page).toHaveTitle(/Teddistory/)

  const cards = page.locator("article")
  await expect(cards).toHaveCount(visiblePostSlugs.length)
  for (const slug of visiblePostSlugs) {
    await expect(page.locator(`a[href="/${slug}"]:has(article)`)).toHaveCount(1)
  }

  const search = page.getByPlaceholder("Search Keyword...")
  await search.fill("INFCON")
  await expect(cards).toHaveCount(1)
  await expect(cards).toContainText("INFCON 2023")
  await search.clear()
  await expect(cards).toHaveCount(visiblePostSlugs.length)

  const themeToggle = page.getByRole("button", { name: /theme/i })
  const initialLabel = await themeToggle.getAttribute("aria-label")
  await themeToggle.click()
  await expect(themeToggle).not.toHaveAttribute(
    "aria-label",
    initialLabel ?? ""
  )
  await expect
    .poll(
      async () =>
        (await page.context().cookies()).find(
          (cookie) => cookie.name === "scheme"
        )?.value
    )
    .toMatch(/^(light|dark)$/)

  const thumbnail = page.locator("article img").first()
  await expect(thumbnail).toBeVisible()
  await expect
    .poll(() =>
      thumbnail.evaluate((image: HTMLImageElement) => image.naturalWidth)
    )
    .toBeGreaterThan(0)

  expect(pageErrors).toEqual([])
})

test("공개된 모든 Notion 상세 경로와 사이트맵이 응답한다", async ({
  request,
}) => {
  const responses = await Promise.all(
    detailSlugs.map(async (slug) => {
      const response = await request.get(`/${slug}`)
      return { slug, response }
    })
  )

  for (const { slug, response } of responses) {
    expect(response.status(), `${slug} status`).toBe(200)
    expect(await response.text(), `${slug} content`).toContain("notion-page")
  }

  const sitemapIndex = await request.get("/sitemap.xml")
  expect(sitemapIndex.status()).toBe(200)
  expect(await sitemapIndex.text()).toContain("sitemap-0.xml")

  const sitemap = await request.get("/sitemap-0.xml")
  expect(sitemap.status()).toBe(200)
  const sitemapText = await sitemap.text()
  for (const slug of detailSlugs) {
    expect(sitemapText).toContain(`/${slug}</loc>`)
  }
})

test("Notion 본문과 Mermaid 12 다이어그램을 렌더링한다", async ({ page }) => {
  const pageErrors: Error[] = []
  page.on("pageerror", (error) => pageErrors.push(error))

  await page.goto("/review-2023")
  await expect(page.locator(".notion-page")).toBeVisible()
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "2023년 리뷰"
  )

  await page.locator("body").evaluate((body) => {
    const diagram = document.createElement("pre")
    diagram.className = "language-mermaid"
    diagram.textContent = "flowchart LR\n  A[Notion] --> B[Mermaid 12]"
    body.append(diagram)
  })

  const diagram = page.locator('.language-mermaid[data-processed="true"] svg')
  await expect(diagram).toBeVisible({ timeout: 15_000 })
  expect(pageErrors).toEqual([])
})

test("모바일 레이아웃에서도 피드와 상세 본문이 표시된다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await expect(page.locator("article")).toHaveCount(visiblePostSlugs.length)

  await page.goto("/first-post")
  await expect(page.locator(".notion-page")).toBeVisible()
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll")
})
