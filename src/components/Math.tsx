import katex from "katex";
import parse from "html-react-parser";

export default function Math({ formula }: { formula: string }) {
    const katexElement = katex.renderToString(formula);
    return <>{parse(katexElement)}</>;
}
