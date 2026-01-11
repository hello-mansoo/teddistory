import dynamic from "next/dynamic"

// This component is isolated to prevent SSR import of pdfjs-dist
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
    loading: () => <div>Loading PDF...</div>,
  }
)

export default Pdf
