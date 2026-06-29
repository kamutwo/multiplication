import { atom, map } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { type Session, type Options, HiddenTerm } from "./session";

const $localSessionHistory = persistentAtom<string>("sessionHistory", "[]");

export const $sessionHistory = atom<Session[]>(JSON.parse($localSessionHistory.get()));
export const $sessionOptions = map<Options>({
    showAnswer: true,
    capAnsweringTime: false,
    multiplicandRanges: [],
    multiplierRanges: [],
    allowedToHide: [HiddenTerm.RESULT],
});

$sessionHistory.listen((v) => {
    $localSessionHistory.set(JSON.stringify(v));
});
