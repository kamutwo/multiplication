import React, { useEffect, useState } from "react";
import { $sessionOptions } from "../scripts/global";
import { type Range } from "../scripts/session";
import { persistentMap } from "@nanostores/persistent";

const $localOptions = persistentMap("sessionOptions", {
    showAnswer: "true",
    capAnsweringTime: "false",
    multiplicandInput: "1-20",
    multiplierInput: "1-20",
});

export default function useOptions() {
    const [showAnswerValue, setShowAnswerValue] = useState($localOptions.get().showAnswer == "true");
    const [capAnsweringTime, setCapAnsweringTimeValue] = useState($localOptions.get().capAnsweringTime == "true");
    const [multiplicandRangesValue, setMultiplicandRangesValue] = useState($localOptions.get().multiplicandInput);
    const [multiplierRangesValue, setMultiplierRangesValue] = useState($localOptions.get().multiplierInput);

    const [multiplicandRangesInvalid, setMultiplicandRangesInvalid] = useState(false);
    const [multiplierRangesInvalid, setMultiplierRangesInvalid] = useState(false);

    const handleShowAnswerChanged = (_: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = !showAnswerValue;

        setShowAnswerValue(newValue);
        $sessionOptions.setKey("showAnswer", newValue);
        $localOptions.setKey("showAnswer", String(newValue));
    };

    const handleCapAnsweringTimeChanged = (_: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = !capAnsweringTime;

        setCapAnsweringTimeValue(newValue);
        $sessionOptions.setKey("capAnsweringTime", newValue);
        $localOptions.setKey("capAnsweringTime", String(newValue));
    }

    const parseTextToRanges = (text: string) => {
        const rangeStrings = text.split(/[\,\s]\s*/g);

        const ranges: Range[] = [];
        for (let i = 0; i < rangeStrings.length; i++) {
            const rangeString = rangeStrings[i];
            if (!/^[-+]?\d{1,3}$|^[-+]?\d{1,3}\s*[-:]\s*[-+]?\d{1,3}$/.test(rangeString)) {
                return [];
            }

            const [start, end] = rangeString.split(/(?<=\d)\s*[-:]\s*/);
            ranges.push({ start: Number(start), end: end == undefined ? Number(start) : Number(end) });
        }
        return ranges;
    };

    const handleMultiplicandRangesChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMultiplicandRangesValue(e.currentTarget.value);
        $localOptions.setKey("multiplicandInput", e.currentTarget.value);

        const ranges = parseTextToRanges(e.currentTarget.value.trim());
        $sessionOptions.setKey("multiplicandRanges", ranges);

        setMultiplicandRangesInvalid(ranges.length == 0);
    };

    const handleMultiplierRangesChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMultiplierRangesValue(e.currentTarget.value);
        $localOptions.setKey("multiplierInput", e.currentTarget.value);

        const ranges = parseTextToRanges(e.currentTarget.value.trim());
        $sessionOptions.setKey("multiplierRanges", ranges);

        setMultiplierRangesInvalid(ranges.length == 0);
    };

    useEffect(() => {
        $sessionOptions.setKey("showAnswer", $localOptions.get().showAnswer == "true");
        $sessionOptions.setKey("capAnsweringTime", $localOptions.get().capAnsweringTime == "true");
        $sessionOptions.setKey("multiplicandRanges", parseTextToRanges(multiplicandRangesValue));
        $sessionOptions.setKey("multiplierRanges", parseTextToRanges(multiplierRangesValue));
    }, []);

    return {
        showAnswerValue,
        capAnsweringTime,

        multiplicandRangesValue,
        multiplierRangesValue,
        multiplicandRangesInvalid,
        multiplierRangesInvalid,

        handleShowAnswerChanged,
        handleCapAnsweringTimeChanged,
        handleMultiplicandRangesChanged,
        handleMultiplierRangesChanged,
    };
}
