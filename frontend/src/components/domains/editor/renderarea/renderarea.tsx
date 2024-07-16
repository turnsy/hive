import Markdown from "react-markdown";

interface RenderFrameProps {
  markdown: string;
}
export default function RenderArea({ markdown }: RenderFrameProps) {
  return <Markdown>{markdown}</Markdown>;
}
