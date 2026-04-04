"use client";

import Badge from "@/components/ui/badge/Badge";
import { filterDashboardAtom, searchFilterDashboardAtom } from "@/jotai/dashboard/filter-dashboard.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetDashboardAccountPayableCard, TDashboardAccountPayableCard } from "@/types/dashboard/cards/dashboard-account-payable-card.type";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { IoArrowDownCircleOutline } from "react-icons/io5";

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    }).format(value ?? 0);
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat("pt-BR").format(value ?? 0);
}
type TProps = {
    data: TDashboardAccountPayableCard
}

export const AccountPayableCard = ({data}: TProps) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 min-h-70">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl dark:bg-red-900/20">
                <svg
                    className="text-red-500 dark:text-red-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                    <line x1="12" y1="14" x2="12" y2="18" />
                    <line x1="10" y1="16" x2="14" y2="16" />
                </svg>
            </div>
            <div className="flex items-end justify-between mt-5 flex-wrap">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Contas a Pagar</span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{formatCurrency(data?.totalAmount ?? 0)}</h4>
                    
                    <div className="mt-1 flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            Em aberto: {formatCurrency(data?.openAmount ?? 0)}{" "}
                            ({formatNumber(data?.openCount ?? 0)})
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            Cancelado: {formatCurrency(data?.cancelAmount ?? 0)}{" "}
                            ({formatNumber(data?.cancelCount ?? 0)})
                        </span>
                        <span className={`text-xs ${data?.overdueAmount > 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            Vencidas: {formatCurrency(data?.overdueAmount ?? 0)}{" "}
                            ({formatNumber(data?.overdueCount ?? 0)})
                        </span>
                    </div>
                </div>
                {(data?.overdueAmount ?? 0) > 0 ? (
                    <Badge color="error">Vencidas</Badge>
                ) : (
                    <Badge color="success">Em dia</Badge>
                )}
            </div>
        </div>
    )
}