import { useEffect, useState } from "react";
import { generateUniqueFormula, type Formula, type Session } from "../scripts/session";
import { $sessionOptions, $sessionHistory } from "../scripts/global";

export default function usePracticeSession() {
    const [formula, setFormula] = useState<Formula | null>(null);

    const [inputValue, setInputValue] = useState("");
    const [isIncorrect, setIsIncorrect] = useState(false);

    const [sessionTimestamp, setSessionTimestamp] = useState(0);
    const [saved, setSaved] = useState(false);

    const [tabbedOutTimestamp, setTabbedOutTimestamp] = useState<null | number>(null);
    const [pausedDuration, setPausedDuration] = useState(0);

    const generateSession = () => {
        const options = $sessionOptions.get();
        const history = $sessionHistory.get();
        const formulaHistory = history.map((session) => session.formula);

        const newFormula = generateUniqueFormula(options, formulaHistory, 4);

        setFormula(newFormula);
        setInputValue("");
        setIsIncorrect(false);
        setSessionTimestamp(Date.now());
        setSaved(false);
        setTabbedOutTimestamp(null);
        setPausedDuration(0);
    };

    const saveToHistory = (session: Session) => {
        if (saved || !formula) return;
        setSaved(true);

        let history = $sessionHistory.get();
        if (history.length >= 500) {
            history = history.slice(0, 499);
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
            duration: Math.max(0, Date.now() - sessionTimestamp - pausedDuration),
        };
        saveToHistory(session);

        setIsIncorrect(!isCorrect);
        if (isCorrect) generateSession();
    };

    useEffect(() => {
        generateSession();
        const unbindSessionOptionListener = $sessionOptions.listen((_v, _oV, key) => {
            if (key != "multiplicandRanges" && key != "multiplierRanges") return;
            generateSession();
        });

        const visibilityChangeListener = (e: Event) => {
            if (document.hidden) {
                setTabbedOutTimestamp(Date.now());
            } else {
                if (tabbedOutTimestamp != null) {
                    setPausedDuration(Date.now() - tabbedOutTimestamp);
                }
            }
        };
        document.addEventListener("visibilitychange", visibilityChangeListener);

        return () => {
            unbindSessionOptionListener();
            document.removeEventListener("visibilitychange", visibilityChangeListener);
        };
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
