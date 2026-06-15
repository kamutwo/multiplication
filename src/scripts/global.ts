import { atom, map } from "nanostores";
import { type Session, type Options, HiddenTerm } from "./session";

export const $sessionHistory = atom<Session[]>([]);
export const $sessionOption = map<Options>({
    multiplicandRanges: [{ start: 2, end: 20 }],
    multipliers: [2],
    allowedToHide: [HiddenTerm.RESULT],
});
