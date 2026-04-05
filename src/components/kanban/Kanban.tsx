"use client";

import { formattedMoney, maskDate } from "@/utils/mask.util";
import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "Em Aberto" | "Fazendo" | "Finalizado";

export interface TOrderServiceKanban {
    id: string;
    code: string;
    customerName: string;
    description: string;
    priority: string;
    status: Status;
    userName?: string;
    value: number;
    createdAt: string;
    forecasDate?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLUMNS: { key: Status; label: string; color: string; bg: string; dot: string }[] = [
    { key: "Em Aberto",  label: "Em aberto",  color: "text-blue-600 dark:text-blue-400",  bg: "bg-blue-50 dark:bg-blue-950/40",  dot: "bg-blue-500" },
    { key: "Fazendo",    label: "Fazendo",    color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", dot: "bg-amber-500" },
    { key: "Finalizado", label: "Finalizado", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/40",  dot: "bg-green-500" },
];

const PRIORITY_STYLE: Record<string, string> = {
    Baixa:   "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    Normal:   "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    Alta:    "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    Urgente: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

const isOverdue = (forecasDate?: string) => {
    if(!forecasDate) return false;

    forecasDate ? new Date(forecasDate) < new Date() : false;
}

// ─── Initials Avatar ──────────────────────────────────────────────────────────

export const Avatar = ({ name }: { name: string }) => {
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

// ─── OS Card ─────────────────────────────────────────────────────────────────

export const KanbanCard = ({
    os,
    onDragStart,
    onClick,
}: {
    os: TOrderServiceKanban;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onClick: (os: TOrderServiceKanban) => void;
}) => {
    const overdue = isOverdue(os.forecasDate);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, os.id)}
            onClick={() => onClick(os)}
            className="group cursor-grab active:cursor-grabbing rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600 select-none"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 font-mono tracking-wide">
                    #{os.code}
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLE[os.priority]}`}>
                    {os.priority}
                </span>
            </div>

            {/* Client + Service */}
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug mb-1 line-clamp-1">
                {os.customerName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3">
                {os.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                    {os.userName && <Avatar name={os.userName} />}
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[90px]">
                        {os.userName ?? "Não atribuído"}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {formattedMoney(os.value)}
                    </span>
                    {os.forecasDate && (
                        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
                            overdue
                                ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                            {maskDate(os.forecasDate)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Column ───────────────────────────────────────────────────────────────────

const KanbanColumn = ({
    col,
    items,
    onDragStart,
    onDrop,
    onDragOver,
    onClick,
}: {
    col: typeof COLUMNS[number];
    items: TOrderServiceKanban[];
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDrop: (e: React.DragEvent, status: Status) => void;
    onDragOver: (e: React.DragEvent) => void;
    onClick: (os: TOrderServiceKanban) => void;
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const total = items.reduce((s, o) => s + o.value, 0);

    return (
        <div
            onDragOver={(e) => { onDragOver(e); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { onDrop(e, col.key); setIsDragOver(false); }}
            className={`flex flex-col rounded-2xl transition-colors duration-150 ${col.bg} ${isDragOver ? "ring-2 ring-brand-400 ring-offset-1" : ""}`}>
            {/* Column Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                    <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                    <span className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${col.color} bg-black/5 dark:bg-white/10`}>
                        {items.length}
                    </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {formattedMoney(total)}
                </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 p-3 flex-1 min-h-[120px]">
                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-black/10 dark:border-white/10">
                        <span className="text-xs text-gray-400 dark:text-gray-600">Solte aqui</span>
                    </div>
                )}
                {items.map((os) => (
                    <KanbanCard key={os.id} os={os} onDragStart={onDragStart} onClick={onClick} />
                ))}
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface OrderServiceKanbanProps {
    items?: TOrderServiceKanban[];
    onStatusChange?: (id: string, newStatus: Status) => Promise<void>;
    onCardClick?: (os: TOrderServiceKanban) => void;
}

// const MOCK_DATA: TOrderServiceKanban[] = [
//     { id: "1", code: "OS001", customerName: "Tech Solutions Ltda", description: "Manutenção de Servidor",   priority: "Alta",    status: "Em aberto",  userName: "Carlos Silva",  value: 850,  createdAt: "2026-03-20", forecasDate: "2026-04-10" },
//     { id: "2", code: "OS002", customerName: "João Pedro Almeida",  description: "Formatação e Limpeza",     priority: "Baixa",   status: "Em aberto",  userName: "Ana Lima",      value: 250,  createdAt: "2026-03-22", forecasDate: "2026-04-08" },
//     { id: "3", code: "OS003", customerName: "Farmácia Central",    description: "Instalação de Rede Wi-Fi", priority: "Média",   status: "Em aberto",  value: 600,  createdAt: "2026-03-25" },
//     { id: "4", code: "OS004", customerName: "Pedro Augusto Costa", description: "Troca de Tela Notebook",  priority: "Urgente", status: "Fazendo",    userName: "Carlos Silva",  value: 420,  createdAt: "2026-03-18", forecasDate: "2026-04-03" },
//     { id: "5", code: "OS005", customerName: "Clínica Bem Estar",   description: "Suporte TI Mensal",        priority: "Alta",    status: "Fazendo",    userName: "Ana Lima",      value: 1200, createdAt: "2026-03-19", forecasDate: "2026-04-15" },
//     { id: "6", code: "OS006", customerName: "Maria Clara Duarte",  description: "Recuperação de Dados",     priority: "Urgente", status: "Fazendo",    userName: "Carlos Silva",  value: 750,  createdAt: "2026-03-21", forecasDate: "2026-04-01" },
//     { id: "7", code: "OS007", customerName: "Escola Nova Vida",    description: "Config. de Computadores",  priority: "Baixa",   status: "Finalizado", userName: "Ana Lima",      value: 1800, createdAt: "2026-03-10", forecasDate: "2026-03-28" },
//     { id: "8", code: "OS008", customerName: "Roberto Fernandes",   description: "Formatação de PC",         priority: "Baixa",   status: "Finalizado", userName: "Carlos Silva",  value: 200,  createdAt: "2026-03-12", forecasDate: "2026-03-20" },
// ];

export const Kanban = ({
    items,
    onStatusChange,
    onCardClick,
}: OrderServiceKanbanProps) => {
    const [newItems, setNewItems] = useState<TOrderServiceKanban[]>(items ?? []);
    const dragId = useRef<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        dragId.current = id;
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, status: Status) => {
        e.preventDefault();
        if (!dragId.current) return;

        const id = dragId.current;
        dragId.current = null;

        setNewItems((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status } : o))
        );

        await onStatusChange?.(id, status);
    };

    const handleCardClick = (os: TOrderServiceKanban) => {
        onCardClick?.(os);
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {COLUMNS.map((col) => (
                <KanbanColumn
                    key={col.key}
                    col={col}
                    items={newItems.filter((o) => o.status === col.key)}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleCardClick}
                />
            ))}
        </div>
    );
};