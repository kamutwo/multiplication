import katex from "katex";
import parse from "html-react-parser";
import { HiddenTerm, type Formula } from "../scripts/Session";

export default function Math({ formula }: { formula: Formula }) {
    const multiplicand = formula.hiddenTerm == HiddenTerm.MULTIPLICAND ? "\\cdots" : formula.multiplicand;
    const multiplier = formula.hiddenTerm == HiddenTerm.MULTIPLIER ? "\\cdots" : formula.multiplier;
    const result = formula.hiddenTerm == HiddenTerm.RESULT ? "\\cdots" : formula.result;

    const katexElement = katex.renderToString(`${multiplicand}\\times${multiplier}=${result}`);
    return <>{parse(katexElement)}</>;
}
