import katex from "katex";
import parse from "html-react-parser";
import { HiddenTerm, type Formula } from "../scripts/session";

export default function KatexFormula({ formula }: { formula: Formula | null }) {
    if (formula == null) {
        return <>?</>
    }

    const multiplicand = formula.hiddenTerm == HiddenTerm.MULTIPLICAND ? "\\cdots" : formula.multiplicand;
    const multiplier = formula.hiddenTerm == HiddenTerm.MULTIPLIER ? "\\cdots" : formula.multiplier;
    const result = formula.hiddenTerm == HiddenTerm.RESULT ? "\\cdots" : formula.result;

    const katexElement = katex.renderToString(`${multiplicand}\\times${multiplier}=${result}`);
    return <>{parse(katexElement)}</>;
}
