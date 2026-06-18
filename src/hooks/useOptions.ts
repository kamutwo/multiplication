import React, { useEffect, useState } from "react";
import { $sessionOption } from "../scripts/global";
import { type Range } from "../scripts/session";

export default function useOptions() {
    const [showAnswerValue, setShowAnswerValue] = useState(true);
    const [multiplicandRangesValue, setMultiplicandRangesValue] = useState("1-10 11 12:20");
    const [multiplierRangesValue, setMultiplierRangesValue] = useState("-2--1 1-2");
    const [multiplicandRangesInvalid, setMultiplicandRangesInvalid] = useState(false);
    const [multiplierRangesInvalid, setMultiplierRangesInvalid] = useState(false);

    const handleShowAnswerChanged = (_: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = !showAnswerValue;

        setShowAnswerValue(newValue);
        $sessionOption.setKey("showAnswer", newValue);
    };

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
        const ranges = parseTextToRanges(e.currentTarget.value.trim());
        $sessionOption.setKey("multiplicandRanges", ranges);

        setMultiplicandRangesInvalid(ranges.length == 0);
    };

    const handleMultiplierRangesChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMultiplierRangesValue(e.currentTarget.value);
        const ranges = parseTextToRanges(e.currentTarget.value.trim());
        $sessionOption.setKey("multiplierRanges", ranges);

        setMultiplierRangesInvalid(ranges.length == 0);
    };

    useEffect(() => {
        $sessionOption.setKey("multiplicandRanges", parseTextToRanges(multiplicandRangesValue));
        $sessionOption.setKey("multiplierRanges", parseTextToRanges(multiplierRangesValue));
    }, []);

    return {
        showAnswerValue,
        multiplicandRangesValue,
        multiplierRangesValue,
        multiplicandRangesInvalid,
        multiplierRangesInvalid,

        handleShowAnswerChanged,
        handleMultiplicandRangesChanged,
        handleMultiplierRangesChanged,
    };
}
