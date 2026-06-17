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
    multiplicandRanges: Range[];
    multipliers: number[];
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
    const rangeFrequencies = ranges.map((r) => Math.abs(r.end - r.start) + 1);
    const totalData = rangeFrequencies.reduce((total, next) => total + next);

    return {
        rangeFrequencies,
        totalData,
    };
}

function getRangeFromGroupedData<T extends Range>(index: number, ranges: T[]) {
    const { rangeFrequencies, totalData } = getBoundsOfRanges(ranges);

    if (index > totalData - 1 || index < 0) return null;

    let currentCumulativeIndex = -1;
    for (let i = 0; i < ranges.length; i++) {
        currentCumulativeIndex += rangeFrequencies[i];
        if (index >= currentCumulativeIndex) {
            return ranges[i];
        }
    }
    return null;
}

function getRandomValueFromRanges<T extends Range>(ranges: T[]) {
    const { totalData } = getBoundsOfRanges(ranges);

    const randomRangesIndex = Math.floor(Math.random() * totalData);
    const range = getRangeFromGroupedData(randomRangesIndex, ranges);
    if (range == null) return null;

    return range.start + Math.floor(Math.random() * (Math.abs(range.end - range.start) + 1));
}

function getRandomValueFromArray<T>(a: T[]) {
    if (a.length == 0) return null;
    if (a.length == 1) return a[0];
    return a[Math.floor(Math.random() * a.length)];
}

function generateFormula(options: Options) {
    const multiplier = getRandomValueFromArray(options.multipliers);
    if (multiplier == null) return null;
    const hiddenTerm = getRandomValueFromArray(options.allowedToHide);
    if (hiddenTerm == null) return null;

    const multiplicand = getRandomValueFromRanges(options.multiplicandRanges);
    if (multiplicand == null) return null;

    const result = multiplicand * multiplier;
    let answer = 0;
    switch (hiddenTerm) {
        case HiddenTerm.MULTIPLICAND:
            answer = multiplicand;
        case HiddenTerm.MULTIPLIER:
            answer = multiplier;
        case HiddenTerm.RESULT:
            answer = result;
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

export { HiddenTerm, generateFormula, generateUniqueFormula };
