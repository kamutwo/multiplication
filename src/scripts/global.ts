import { atom, map } from "nanostores";
import { type Session, type Options, HiddenTerm } from "./session";

export const $sessionHistory = atom<Session[]>([]);
export const $sessionOption = map<Options>({
    showAnswer: true,
    multiplicandRanges: [],
    multiplierRanges: [],
    allowedToHide: [HiddenTerm.RESULT],
});
