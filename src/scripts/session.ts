enum HiddenTerm {
    MULTIPLICAND,
    MULTIPLIER,
    RESULT,
}

export type MultiplicandRange = {
    start: number;
    end: number;
};

export type Options = {
    multiplicandRanges: MultiplicandRange[];
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

const getRandomElement = <T>(a: T[]) => {
    if (a.length == 0) return null;
    if (a.length == 1) return a[0];
    return a[Math.floor(Math.random() * a.length)];
};

function generateFormula(options: Options) {
    const multiplicandMagnitudes = options.multiplicandRanges.map((range) => range.end - range.start + 1);
    const multiplicandRangeSize = multiplicandMagnitudes.reduce((total, current) => total + current);

    // min: 1, max: multiplicandRangeSize
    const getMultiplicandRange = (cumulativeMagnitude: number) => {
        if (cumulativeMagnitude > multiplicandRangeSize || cumulativeMagnitude < 1) return null;

        let currentCumulativeMagnitude = 0;
        for (let i = 0; i < multiplicandMagnitudes.length; i++) {
            currentCumulativeMagnitude += multiplicandMagnitudes[i];
            if (currentCumulativeMagnitude >= cumulativeMagnitude) {
                return options.multiplicandRanges[i];
            }
        }
        return null;
    };

    const getRandomMultiplicand = () => {
        const randomCumulativeMagnitude = Math.floor(Math.random() * multiplicandRangeSize) + 1;
        const multiplicandRange = getMultiplicandRange(randomCumulativeMagnitude);
        if (multiplicandRange == null) return null;

        return multiplicandRange.start + Math.floor(Math.random() * (Math.abs(multiplicandRange.end - multiplicandRange.start) + 1));
    };

    const multiplier = getRandomElement(options.multipliers);
    if (multiplier == null) return null;
    const hiddenTerm = getRandomElement(options.allowedToHide);
    if (hiddenTerm == null) return null;

    const multiplicand = getRandomMultiplicand();
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
