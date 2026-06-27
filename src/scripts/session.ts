enum HiddenTerm {
    MULTIPLICAND,
    MULTIPLIER,
    RESULT,
}

export type Range = {
    start: number;
    end: number;
};

export type Options = {
    showAnswer: boolean;
    multiplicandRanges: Range[];
    multiplierRanges: Range[];
    allowedToHide: HiddenTerm[];
};

export type Formula = {
    multiplicand: number;
    multiplier: number;
    result: number;
    answer: number;
    hiddenTerm: HiddenTerm;
};

export type Session = {
    formula: Formula;
    input: string;
    correct: boolean;
    duration: number;
};

function getBoundsOfRanges<T extends Range>(ranges: T[]) {
    if (ranges.length == 0) return { rangeFrequencies: [], totalData: 0 };

    const rangeFrequencies = ranges.map((r) => Math.abs(r.end - r.start) + 1);
    const totalData = rangeFrequencies.reduce((total, next) => total + next);

    return {
        rangeFrequencies,
        totalData,
    };
}

function getRangeFromRanges<T extends Range>(index: number, ranges: T[]) {
    const { rangeFrequencies, totalData } = getBoundsOfRanges(ranges);

    if (index > totalData - 1 || index < 0) return null;

    let currentCumulativeIndex = -1;
    for (let i = 0; i < ranges.length; i++) {
        currentCumulativeIndex += rangeFrequencies[i];
        if (index <= currentCumulativeIndex) {
            return ranges[i];
        }
    }
    return null;
}

function getAllValuesFromRange<T extends Range>(range: T) {
    const left = Math.min(range.start, range.end);

    const values = Array.from({ length: Math.abs(range.end - range.start) + 1 }, (_, i) => left + i);
    if (left != range.start) {
        return values.reverse();
    }
    return values;
}

function getAllValuesFromRanges<T extends Range>(range: T[]) {
    return range.flatMap((range) => getAllValuesFromRange(range)).sort();
}

function getRandomValueFromRanges<T extends Range>(ranges: T[]) {
    const { totalData } = getBoundsOfRanges(ranges);

    const randomRangesIndex = Math.floor(Math.random() * totalData);
    const range = getRangeFromRanges(randomRangesIndex, ranges);
    if (range == null) return null;

    const left = Math.min(range.start, range.end);
    const right = Math.max(range.start, range.end);

    return left + Math.floor(Math.random() * (Math.abs(right - left) + 1));
}

function getRandomValueFromArray<T>(a: T[]) {
    if (a.length == 0) return null;
    if (a.length == 1) return a[0];
    return a[Math.floor(Math.random() * a.length)];
}

function generateFormula(options: Options) {
    const hiddenTerm = getRandomValueFromArray(options.allowedToHide);
    if (hiddenTerm == null) return null;

    const multiplicand = getRandomValueFromRanges(options.multiplicandRanges);
    if (multiplicand == null) return null;

    const multiplier = getRandomValueFromRanges(options.multiplierRanges);
    if (multiplier == null) return null;

    const result = multiplicand * multiplier;
    let answer = 0;
    switch (hiddenTerm) {
        case HiddenTerm.MULTIPLICAND:
            answer = multiplicand;
            break;
        case HiddenTerm.MULTIPLIER:
            answer = multiplier;
            break;
        case HiddenTerm.RESULT:
            answer = result;
            break;
    }

    return {
        multiplicand: multiplicand,
        multiplier: multiplier,
        result: result,
        answer: answer,
        hiddenTerm: hiddenTerm,
    } as Formula;
}

function generateUniqueFormula(options: Options, history?: Formula[], lookBackLength: number = 4) {
    if (!options) return null;
    let formula = generateFormula(options);

    const filteredResults = history?.map((v) => v.result).slice(0, lookBackLength);

    let attempts = 0;
    while (formula && filteredResults && filteredResults.includes(formula.result) && attempts < 10) {
        formula = generateFormula(options);
        attempts++;
    }

    return formula;
}

function shuffle<T>(array: T[]) {
    const shuffledArray = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function generateQueue(options: Options, sessionHistory: Session[]): Formula[] {
    const queue: Formula[] = [];

    const multiplicands = getAllValuesFromRanges(options.multiplicandRanges);
    const multipliers = getAllValuesFromRanges(options.multiplierRanges);

    for (const multiplicand of multiplicands) {
        for (const hiddenTerm of options.allowedToHide) {
            for (const multiplier of multipliers) {
                const result = multiplicand * multiplier;
                let answer = 0;
                switch (hiddenTerm) {
                    case HiddenTerm.MULTIPLICAND:
                        answer = multiplicand;
                        break;
                    case HiddenTerm.MULTIPLIER:
                        answer = multiplier;
                        break;
                    case HiddenTerm.RESULT:
                        answer = result;
                        break;
                }

                queue.push({
                    multiplicand,
                    hiddenTerm,
                    multiplier,
                    result,
                    answer,
                });
            }
        }
    }

    return shuffle(queue);
}

export { HiddenTerm, generateFormula, generateUniqueFormula, generateQueue };
