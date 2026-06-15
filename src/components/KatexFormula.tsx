import katex from "katex";
import parse from "html-react-parser";
import { HiddenTerm, type Formula } from "../scripts/session";

export default function KatexFormula({ formula, hideTerm }: { formula: Formula | null, hideTerm?: HiddenTerm }) {
    if (formula == null) {
        return <>?</>
    }

    const multiplicand = hideTerm == HiddenTerm.MULTIPLICAND ? "\\cdots" : formula.multiplicand;
    const multiplier = hideTerm == HiddenTerm.MULTIPLIER ? "\\cdots" : formula.multiplier;
    const result = hideTerm == HiddenTerm.RESULT ? "\\cdots" : formula.result;

    const katexElement = katex.renderToString(`${multiplicand}\\times${multiplier}=${result}`);
    return <>{parse(katexElement)}</>;
}
