"use client";

import { formattedMoney, maskDate } from "@/utils/mask.util";

const PRIORITY_STYLE: Record<Priority, string> = {
    Baixa:   "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    Média:   "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    Alta:    "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    Urgente: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

type Priority = "Baixa" | "Média" | "Alta" | "Urgente";
type Status = "Em aberto" | "Fazendo" | "Finalizado";

export type TKanbanCard = {
    code: string;
    priority: Priority;
    clienteName: string;
    serviceType: string;
    assignedTo: string;
    value: number;
    date: any;
}

const Avatar = ({ name }: { name: string }) => {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 text-[10px] font-semibold shrink-0">
            {initials}
        </span>
    );
};

export const KanbanCard = ({code, priority, clienteName, serviceType, assignedTo, value, date}: TKanbanCard) => {
    return (
        <div
            draggable
            className="group cursor-grab active:cursor-grabbing rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600 select-none">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 font-mono tracking-wide">
                    #{code}
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLE[priority]}`}>
                    {priority}
                </span>
            </div>
        
            {/* Client + Service */}
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug mb-1 line-clamp-1">
                {clienteName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3">
                {serviceType}
            </p>
        
            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                    {assignedTo && <Avatar name={assignedTo} />}
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[90px]">
                        {assignedTo ?? "Não atribuído"}
                    </span>
                </div>
        
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {formattedMoney(value)}
                    </span>
                    {date && (
                        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
                            date ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                            {maskDate(date)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}