"use client";

import Button from "../ui/button/Button";
import { BiPlus } from "react-icons/bi";

type TProp = {
    code: string;
    label: string;
    options: any[];
    disabled?: boolean;
};

export const Select = ({options, code, label, disabled, ...rest}: TProp) => {

    return (
        <div className="relative">
            <select {...rest} disabled={disabled} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-gray-800">
                {
                    options.map((o: any) => (
                        <option key={o[code]} value={o[code]}>{o[label]}</option>
                    ))
                }
            </select>
        </div>
    );
}