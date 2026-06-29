import React, { useState } from "react";
import useOptions from "../hooks/useOptions";

export default function PracticeOptions() {
    const [isOpen, setIsOpen] = useState(true);
    const {
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
    } = useOptions();

    const handleOpen = (e: React.MouseEvent) => {
        if (e.button == 0) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="mt-8 px-4 py-1 rounded-sm font-bold text-blue-400/80 hover:bg-blue-400/20 active:scale-95 hover:cursor-pointer"
            >
                {isOpen ? "Close Options" : "Open Options"}
            </button>

            <div className={`grid transition-all ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                    <div className="flex flex-col items-center">
                        <div className="w-full mt-4 mb-4 border border-gray-800"></div>
                    </div>
                    <div className="flex flex-col gap-4 text-sm text-gray-100/60">
                        <div>
                            <input id="show_answer" type="checkbox" checked={showAnswerValue} onChange={handleShowAnswerChanged}></input>
                            <label htmlFor="show_answer" className="ml-2">
                                Show answer when incorrect?
                            </label>
                        </div>
                        <div className="flex justify-between gap-4 w-full">
                            <div className="w-full">
                                <label htmlFor="multiplicand_ranges">Multiplicand Ranges</label>
                                <input
                                    id="multiplicand_ranges"
                                    autoComplete="off"
                                    type="text"
                                    value={multiplicandRangesValue}
                                    onChange={handleMultiplicandRangesChanged}
                                    className={`w-full py-2 px-4 mt-1 rounded-md text-xs bg-transparent outline-none border
                                        ${multiplicandRangesInvalid ? "border-red-500/80 text-red-500/80" : "border-gray-800 focus:border-blue-500/70"}`}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="multiplier_ranges">Multiplier Ranges</label>
                                <input
                                    id="multiplier_ranges"
                                    autoComplete="off"
                                    type="text"
                                    value={multiplierRangesValue}
                                    onChange={handleMultiplierRangesChanged}
                                    className={`w-full py-2 px-4 mt-1 rounded-md text-xs bg-transparent outline-none border
                                        ${multiplierRangesInvalid ? "border-red-500/80 text-red-500/80" : "border-gray-800 focus:border-blue-500/70"}`}
                                />
                            </div>
                        </div>
                        <div>
                            <input id="time_cap" type="checkbox" checked={capAnsweringTime} onChange={handleCapAnsweringTimeChanged}></input>
                            <label htmlFor="time_cap" className="ml-2">
                                Enable time cap for answering
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
