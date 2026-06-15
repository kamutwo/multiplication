import { useState } from "react";
import Math from "./Math";

export default function Practice() {
    const [value, setValue] = useState("");
    const [invalid, setInvalid] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.currentTarget.value;

        const regex = /^[+\-]?$|[+\-]?(?:0|[0-9]\d*)(?:[\.\,]|[\.\,]\d+)?(?:(?:[eE]|[eE][+\-])$|[eE][+\-]?\d+)?$/;
        if (regex.test(v)) {
            setValue(v);
        }
    };

    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            const v = Number(e.currentTarget.value);
            if (isNaN(v)) {
                setInvalid(true);
                return;
            }
            setInvalid(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-gray-700">Practice</h1>
            <div className="w-[95%] my-2 border border-gray-800"></div>
            <div className="flex items-center min-h-16">
                <Math formula="1\times1" />
            </div>
            <input
                value={value}
                onChange={handleChange}
                onKeyDown={onEnter}
                autoComplete="off"
                placeholder="answer"
                type="text"
                inputMode="numeric"
                id="answer"
                className={`py-2 rounded-md bg-transparent outline-none border ${invalid ? "border-red-500/80 text-red-500/80" : "border-gray-800 focus:border-blue-500/70"} text-center`}
            />
            {invalid && <p className="mt-1 text-xs text-red-500/80">?</p>}
        </div>
    );
}
