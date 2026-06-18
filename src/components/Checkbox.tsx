import type React from "react";

export default function Checkbox({ id, onChange, label }: { id: string, onChange?: React.ChangeEvent; label?: string }) {
    return (
        <div className="flex items-center gap-2">
            <input
                id={id}
                type="checkbox"
                className="appearance-none w-5 h-5 bg-transparent rounded-sm outline-none border border-gray-800 checked:bg-blue-500/70 checked:border-blue-500 transition-colors duration-75"
            ></input>
            {label && <label htmlFor={id}>{label}</label>}
        </div>
    );
}
