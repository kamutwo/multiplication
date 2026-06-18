import { useEffect, useState } from "react";
import { generateFormula, generateUniqueFormula, type Formula, type Session } from "../scripts/session";
import { $sessionOption, $sessionHistory } from "../scripts/global";

export default function usePracticeSession() {
    const [formula, setFormula] = useState<Formula | null>(null);

    const [inputValue, setInputValue] = useState("");
    const [isIncorrect, setIsIncorrect] = useState(false);

    const [sessionTimestamp, setSessionTimestamp] = useState(0);
    const [saved, setSaved] = useState(false);

    const generateSession = () => {
        const options = $sessionOption.get();
        const history = $sessionHistory.get();
        const formulaHistory = history.map((session) => session.formula);

        const newFormula = generateUniqueFormula(options, formulaHistory);

        setFormula(newFormula);
        setInputValue("");
        setIsIncorrect(false);
        setSessionTimestamp(Date.now());
        setSaved(false);
    };

    const saveToHistory = (session: Session) => {
        if (saved || !formula) return;
        setSaved(true);

        let history = $sessionHistory.get();
        if (history.length >= 25) {
            history = history.slice(0, 24);
        }

        $sessionHistory.set([session, ...history]);
    };

    const handleAnswer = (answer: number | string) => {
        if (!formula) return;
        const number = Number(answer);

        const isCorrect = !isNaN(number) && Math.abs(number - formula.answer) < 0.01;

        const session: Session = {
            formula,
            correct: isCorrect,
            input: answer.toString(),
            duration: Date.now() - sessionTimestamp,
        };
        saveToHistory(session);

        setIsIncorrect(!isCorrect);
        if (isCorrect) generateSession();
    };

    useEffect(() => {
        generateSession();
        const unbind = $sessionOption.listen((_v, _oV, key) => {
            if (key != "multiplicandRanges" && key != "multiplierRanges") return;
            generateSession();
        });

        return () => unbind();
    }, []);

    return {
        inputValue,
        setInputValue,
        isIncorrect,
        formula,

        handleAnswer,
        generateSession,
    };
}
