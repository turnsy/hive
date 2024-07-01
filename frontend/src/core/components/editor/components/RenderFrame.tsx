import Markdown from "react-markdown";

interface RenderFrameProps {
    markdown: string
}
export default function RenderFrame({markdown}: RenderFrameProps) {
    return (
        <Markdown>
            {markdown}
        </Markdown>
    )
}