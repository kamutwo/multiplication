import { useEffect, useState } from "react";
import { type Formula, generateFormula, HiddenTerm } from "../scripts/session";
import { $sessionOption, $sessionHistory } from "../scripts/global";
import KatexFormula from "./KatexFormula";

export default function Practice() {
    const [value, setValue] = useState("");
    const [invalid, setInvalid] = useState(false);

    const [currentFormula, setFormula] = useState<Formula | null>(null);

    const generateSession = () => {
        const options = $sessionOption.get();
        if (options == null) {
            setFormula(null);
            return;
        }

        let formula = generateFormula(options);
        const history = $sessionHistory.get();
        while (history.length > 0 && formula != null && history[history.length - 1].formula.result == formula.result) {
            formula = generateFormula(options);
        }

        setValue("");
        setInvalid(false);
        setFormula(formula);
    };

    const validateAnswer = (answer: number) => {
        if (currentFormula == null) return;

        if (!isNaN(answer) && Math.abs(answer - currentFormula.answer) < 0.01) {
            setValue("");
            generateSession();
        } else {
            setInvalid(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;

        const regex = /^[+\-]?$|[+\-]?(?:0|[0-9]\d*)(?:[\.\,]|[\.\,]\d+)?(?:(?:[eE]|[eE][+\-])$|[eE][+\-]?\d+)?$/;
        if (regex.test(inputValue)) {
            setValue(inputValue);
        }

        if (currentFormula == null) return;

        const value = Number(inputValue);
        if (!isNaN(value) && Math.floor(Math.log10(value) + 1) == Math.floor(Math.log10(currentFormula.answer) + 1)) {
            validateAnswer(value);
        }
    };

    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            if (invalid || e.currentTarget.value.trim() == "") {
                generateSession();
            } else {
                const value = Number(e.currentTarget.value);
                validateAnswer(value);
            }
        }
    };

    useEffect(() => {
        generateSession();
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-gray-700">Practice</h1>
            <div className="w-[95%] my-2 border border-gray-800"></div>
            <div className="flex items-center min-h-16">
                <KatexFormula formula={currentFormula} />
            </div>
            <input
                value={value}
                onChange={handleChange}
                onKeyDown={onEnter}
                autoComplete="off"
                placeholder="answer"
                type="text"
                inputMode="numeric"
                id="answer"
                className={`py-2 px-4 rounded-md bg-transparent outline-none border ${invalid ? "border-red-500/80 text-red-500/80" : "border-gray-800 focus:border-blue-500/70"} text-center`}
            />
            {invalid && currentFormula != null && <p className="mt-1 text-xs text-red-500/80">{currentFormula.answer}</p>}
        </div>
    );
}
