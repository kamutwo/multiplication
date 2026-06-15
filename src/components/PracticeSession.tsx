import KatexFormula from "./KatexFormula";
import usePracticeSession from "../hooks/usePracticeSession";

export default function PracticeSession() {
    const {
        inputValue,
        setInputValue,
        isIncorrect,
        formula,

        handleAnswer,
        generateSession,
    } = usePracticeSession();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;

        const regex = /^[+\-]?$|[+\-]?(?:0|[0-9]\d*)(?:[\.\,]|[\.\,]\d+)?(?:(?:[eE]|[eE][+\-])$|[eE][+\-]?\d+)?$/;
        if (regex.test(val)) {
            setInputValue(val);
        }

        if (formula == null) return;
        const valNumber = Number(val);
        if (!isNaN(valNumber) && Math.floor(Math.log10(valNumber) + 1) == Math.floor(Math.log10(formula.answer) + 1)) {
            handleAnswer(val);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        handleAnswer(e.currentTarget.value);
        if (isIncorrect || e.currentTarget.value.trim() == "") {
            generateSession();
        }
    };

    return (
        <>
            <div className="flex items-center min-h-16">
                <KatexFormula formula={formula} hideTerm={formula?.hiddenTerm} />
            </div>
            <input
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                placeholder="answer"
                type="text"
                inputMode="numeric"
                id="answer"
                className={`py-2 px-4 rounded-md bg-transparent outline-none border text-center
                    ${isIncorrect ? "border-red-500/80 text-red-500/80" : "border-gray-800 focus:border-blue-500/70"}`}
            />
            {isIncorrect && formula != null && <p className="mt-1 text-xs text-red-500/80">{formula.answer}</p>}
        </>
    );
}
