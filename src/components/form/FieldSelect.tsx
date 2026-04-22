import Label from "./Label";

type TProp = {
    cols: string;
    label: string;
    registration: object;
    options: any[];
    optionValue: string;
    optionLabel: string;
    required?: boolean;
}

export const FieldSelect = ({ cols, label, registration, options, required = true, optionValue, optionLabel }: TProp) => {
    return (
        <div className={`${cols}`}>
            <Label title={label} required={required}/>
            <select
                {...registration}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800 dark:bg-dark-900"
            >
                <option value="" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Selecione</option>
                {options.map((option) => (
                    <option key={option[optionValue]} value={option[optionValue]} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        {option[optionLabel]}
                    </option>
                ))}
            </select>
        </div>
    )
}