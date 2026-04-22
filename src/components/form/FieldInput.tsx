"use client";

import { useEffect, useRef } from "react";
import Label from "./Label";
import { toast } from "react-toastify";

type TProp = {
    cols: string;
    label: string;
    required?: boolean;
    placeholder: string;
    type?: string;
    registration: object;
    fnMask?: (e: any) => void;
}

export const FieldInput = ({ cols, label, placeholder, type = "text", registration, required = true, fnMask }: TProp) => {
    return (
        <div className={`${cols}`}>
            <Label title={label} required={required}/>
            <input
                onInput={(e) => fnMask && fnMask(e)}
                placeholder={placeholder}
                {...registration}
                type={type}
                className="input-erp-primary input-erp-default"
            />
        </div>
    )
}