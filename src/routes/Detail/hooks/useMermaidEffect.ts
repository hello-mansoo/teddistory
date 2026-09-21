import mermaid from "mermaid"
import { useEffect } from "react"

const useMermaidEffect = () => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
    })

    let renderScheduled = false
    const renderDiagrams = async () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".language-mermaid:not([data-processed])"
        )
      )
      if (!nodes.length) return

      try {
        await mermaid.run({ nodes })
      } catch (error) {
        console.error("Failed to render Mermaid diagram", error)
      }
    }

    const scheduleRender = () => {
      if (renderScheduled) return
      renderScheduled = true
      queueMicrotask(() => {
        renderScheduled = false
        void renderDiagrams()
      })
    }

    const observer = new MutationObserver(scheduleRender)
    observer.observe(document.body, { childList: true, subtree: true })
    scheduleRender()

    return () => observer.disconnect()
  }, [])
}

export default useMermaidEffect
