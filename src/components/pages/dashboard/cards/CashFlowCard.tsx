"use client";

import Badge from "@/components/ui/badge/Badge";
import { TDashboardCashFlowCard } from "@/types/dashboard/cards/dashboard-cash-flow-card.type";
import { formattedMoney } from "@/utils/mask.util";
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io";
import { MdAccountBalanceWallet, MdTrendingDown, MdTrendingUp } from "react-icons/md";

type TProps = {
    data: TDashboardCashFlowCard
}

export const CashFlowCard = ({data}: TProps) => {
    return (
        <div className="grid grid-cols-12 gap-4 col-span-12 md:col-span-4 lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3 md:py-6 min-h-70">
            <h6 className="col-span-12 font-bold text-gray-800 dark:text-white/90">Fluxo de Caixa</h6>
            <div className="col-span-12 md:col-span-4 lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/3 md:p-3">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-xl dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                    <MdAccountBalanceWallet size={24} />
                </div>
                <div className="flex items-end justify-between mt-5 flex-wrap">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Saldo Total</span>
                        <div className="flex gap-4 items-center flex-wrap">
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                {formattedMoney(data?.balance ?? 0)}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/3 md:p-3">
                <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    <MdTrendingUp size={24} />
                </div>
                <div className="flex items-end justify-between mt-5 flex-wrap">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Entrada Total</span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formattedMoney(data?.entries ?? 0)}
                        </h4>
                    </div>
                </div>
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/3 md:p-3">
                <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    <MdTrendingDown size={24} />
                </div>
                <div className="flex items-end justify-between mt-5 flex-wrap">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Saida Total</span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formattedMoney(data?.exits ?? 0)}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    )
}