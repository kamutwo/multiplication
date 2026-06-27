import { useEffect, useRef, useState } from "react";
import { generateQueue, generateUniqueFormula, type Formula, type Session } from "../scripts/session";
import { $sessionOptions, $sessionHistory } from "../scripts/global";

export default function usePracticeSession() {
    const [formula, setFormula] = useState<Formula | null>(null);

    const [inputValue, setInputValue] = useState("");
    const [isIncorrect, setIsIncorrect] = useState(false);

    const srsQueue = useRef<Formula[]>([]);
    const cardSteps = useRef<Record<string, number>>({});

    const sessionTimestamp = useRef(0);
    const tabbedOutTimestamp = useRef<null | number>(null);
    const pausedDuration = useRef(0);
    const questionTimer = useRef<null | NodeJS.Timeout>(null);

    const saved = useRef(false);

    const getCardKey = (f: Formula) => `${f.multiplicand}x${f.multiplier}_${f.hiddenTerm}`;

    const generateSession = (currentQueue: Formula[] = srsQueue.current) => {
        if (questionTimer.current) clearTimeout(questionTimer.current);

        let nextFormula: Formula | null;

        console.clear();
        if (currentQueue.length > 0) {
            const [head, ...tail] = currentQueue;
            nextFormula = head;
            srsQueue.current = tail;
        } else {
            const options = $sessionOptions.get();
            const history = $sessionHistory.get();
            const formulaHistory = history.map((session) => session.formula);
            nextFormula = generateUniqueFormula(options, formulaHistory, 4);
        }

        if (nextFormula != null) questionTimer.current = setTimeout(() => handleTimeout(nextFormula), 2500);
        currentQueue.forEach((f, i) => console.log(i, f.answer));

        setFormula(nextFormula);
        setInputValue("");
        setIsIncorrect(false);

        sessionTimestamp.current = Date.now();
        saved.current = false;
        tabbedOutTimestamp.current = null;
        pausedDuration.current = 0;
    };

    const saveToHistory = (session: Session) => {
        if (saved.current || !formula) return;
        saved.current = true;

        let history = $sessionHistory.get();
        if (history.length >= 500) {
            history = history.slice(0, 499);
        }

        $sessionHistory.set([session, ...history]);
    };

    const handleAnswer = (answer: number | string) => {
        if (!formula) return;
        if (questionTimer.current) clearTimeout(questionTimer.current);

        const number = Number(answer);
        const isCorrect = !isNaN(number) && Math.abs(number - formula.answer) < 0.01;

        const elapsed = Date.now() - sessionTimestamp.current - pausedDuration.current;

        const session: Session = {
            formula,
            correct: isCorrect,
            input: answer.toString(),
            duration: Math.max(0, elapsed),
        };

        if (!saved.current) {
            const cardKey = getCardKey(formula);
            const currentStep = cardSteps.current[cardKey] || 0;

            if (isCorrect) {
                const nextStep = currentStep + 1;

                cardSteps.current[cardKey] = nextStep;

                const baseSpacing = (nextStep + 1) * 4;
                const insertIndex = Math.max(1, Math.min(baseSpacing, srsQueue.current.length));

                srsQueue.current.splice(insertIndex, 0, formula);
            } else {
                cardSteps.current[cardKey] = 0;

                const insertIndex = Math.min(4, srsQueue.current.length);
                srsQueue.current.splice(insertIndex, 0, formula);
            }
        }

        saveToHistory(session);
        setIsIncorrect(!isCorrect);

        if (isCorrect) {
            generateSession();
        }
    };

    const handleTimeout = (timedOutFormula: Formula) => {
        setIsIncorrect(true);

        const session: Session = {
            formula: timedOutFormula,
            correct: false,
            input: "",
            duration: 2500,
        };

        if (!saved.current) {
            saveToHistory(session);

            const cardKey = getCardKey(timedOutFormula);
            cardSteps.current[cardKey] = 0;

            const insertIndex = Math.min(4, srsQueue.current.length);
            srsQueue.current.splice(insertIndex, 0, timedOutFormula);
        }
    };

    useEffect(() => {
        srsQueue.current = generateQueue($sessionOptions.get(), $sessionHistory.get());
        generateSession();

        const unbindSessionOptionListener = $sessionOptions.listen((v, _oV, key) => {
            if (key != "multiplicandRanges" && key != "multiplierRanges") return;
            cardSteps.current = {};
            srsQueue.current = generateQueue($sessionOptions.get(), $sessionHistory.get());
            generateSession();
        });

        const visibilityChangeListener = () => {
            if (document.hidden) {
                tabbedOutTimestamp.current = Date.now();
            } else {
                if (tabbedOutTimestamp.current !== null) {
                    pausedDuration.current += Date.now() - tabbedOutTimestamp.current;
                    tabbedOutTimestamp.current = null;
                }
            }
        };
        document.addEventListener("visibilitychange", visibilityChangeListener);

        return () => {
            unbindSessionOptionListener();
            document.removeEventListener("visibilitychange", visibilityChangeListener);
            if (questionTimer.current) clearTimeout(questionTimer.current);
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
