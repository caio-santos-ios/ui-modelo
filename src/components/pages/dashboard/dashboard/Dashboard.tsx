"use client";

import Button from "@/components/ui/button/Button";
import { filterDashboardAtom, searchFilterDashboardAtom } from "@/jotai/dashboard/filter-dashboard.jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { AccountReceivableCard } from "../cards/AccountReceivableCard";
import { AccountPayableCard } from "../cards/AccountPayableCard";
import { CashFlowCard } from "../cards/CashFlowCard";
import { ResetDashboardCashFlowCard, TDashboardCashFlowCard } from "@/types/dashboard/cards/dashboard-cash-flow-card.type";
import { configApi, resolveResponse } from "@/service/config.service";
import { api } from "@/service/api.service";
import { ResetDashboardAccountPayableCard, TDashboardAccountPayableCard } from "@/types/dashboard/cards/dashboard-account-payable-card.type";
import { ResetDashboardAccountReceivableCard, TDashboardAccountReceivableCard } from "@/types/dashboard/cards/dashboard-account-receivable-card.type";
import { ExpenseCategoryPie } from "../pie/ExpenseCategoryPie";
import { EvolutionBalanceArea } from "../area/EvolutionBalanceArea";
import { TopRevenueBar } from "../bars/TopRevenueBar";
import { EntriesExitsBar } from "../bars/EntriesExitsBar";
import { ResetDashboardEntrieExitBar, TDashboardEntrieExitBar } from "@/types/dashboard/bars/dashboard-entrie-exit-bar.type";
import { ResetDashboardExpenseCategoryPie, TDashboardExpenseCategoryPie } from "@/types/dashboard/pie/dashboard-expense-category-pie.type";
import { ResetDashboardEvolutionBalanceArea, TDashboardEvolutionBalanceArea } from "@/types/dashboard/area/dashboard-evolution-balance-area.type";
import { ResetDashboardTopRevenueBar, TDashboardTopRevenueBar } from "@/types/dashboard/bars/dashboard-top-revenue-bar.type";

export const Dashboard = () => {
    const [filterDashboard, setFilterDashboard] = useAtom(filterDashboardAtom);
    const [search, setSearch] = useAtom(searchFilterDashboardAtom);
    const [loading, setLoading] = useState<boolean>(false);

    // CARDS
    const [dashboardAccountPayableCard, setDashboardAccountPayableCard] = useState<TDashboardAccountPayableCard>(ResetDashboardAccountPayableCard);
    const [dashboardAccountReceivableCard, setDashboardAccountReceivableCard] = useState<TDashboardAccountReceivableCard>(ResetDashboardAccountReceivableCard);
    const [dashboardCashFlowCard, setDashboardCashFlowCard] = useState<TDashboardCashFlowCard>(ResetDashboardCashFlowCard);
    
    // BARS
    const [dashboardEntrieExitBar, setDashboardEntrieExitBar] = useState<TDashboardEntrieExitBar>(ResetDashboardEntrieExitBar);
    const [dashboardTopRevenueBar, setDashboardTopRevenueBar] = useState<TDashboardTopRevenueBar>(ResetDashboardTopRevenueBar);
    
    // PIE
    const [dashboardExpenseCategoryPie, setDashboardExpenseCategoryPie] = useState<TDashboardExpenseCategoryPie>(ResetDashboardExpenseCategoryPie);
    
    // AREA
    const [dashboardEvolutionBalanceArea, setDashboardEvolutionBalanceArea] = useState<TDashboardEvolutionBalanceArea>(ResetDashboardEvolutionBalanceArea);


    const getDashboards = async (startDate: string, endDate: string) => {
        try {
            const [
                accReCard, accPaCard, cashCard,

                enExBar, topReve,

                exCate,

                evoBal
            ] = await Promise.all([
                // CARDS
                api.get(`/dashboard/accounts-receivable?startDate=${startDate}&endDate=${endDate}`, configApi()),
                api.get(`/dashboard/accounts-payable?startDate=${startDate}&endDate=${endDate}`, configApi()),
                api.get(`/dashboard/cash-flow?startDate=${startDate}&endDate=${endDate}`, configApi()),

                // BARS
                api.get(`/dashboard/entrie-exit?startDate=${startDate}&endDate=${endDate}`, configApi()),
                api.get(`/dashboard/top-revenue?startDate=${startDate}&endDate=${endDate}`, configApi()),

                // PIE
                api.get(`/dashboard/expense-category?startDate=${startDate}&endDate=${endDate}`, configApi()),
                
                // AREA
                api.get(`/dashboard/evolution-balance?startDate=${startDate}&endDate=${endDate}`, configApi()),
            ]);

            //CARDS 
            setDashboardAccountReceivableCard(accReCard?.data?.result?.data ?? ResetDashboardAccountReceivableCard);
            setDashboardAccountPayableCard(accPaCard?.data?.result?.data ?? ResetDashboardAccountPayableCard);
            setDashboardCashFlowCard(cashCard?.data?.result?.data ?? ResetDashboardCashFlowCard);

            // BARS
            setDashboardEntrieExitBar(enExBar?.data?.result?.data ?? ResetDashboardEntrieExitBar);
            setDashboardTopRevenueBar(topReve?.data?.result?.data ?? ResetDashboardTopRevenueBar);
            
            // PIE
            setDashboardExpenseCategoryPie(exCate?.data?.result?.data ?? ResetDashboardExpenseCategoryPie);
            
            // AREA
            setDashboardEvolutionBalanceArea(evoBal?.data?.result?.data ?? ResetDashboardEvolutionBalanceArea);
        } catch (error) {
            resolveResponse(error);
        }
    };
    
    const handleFilter = () => {
        setLoading(true);
        setFilterDashboard({
            startDate: filterDashboard.startDate,
            endDate: filterDashboard.endDate,
        });
        getDashboards(filterDashboard.startDate, filterDashboard.endDate);
        setLoading(false);
    };

    useEffect(() => {
        const today = new Date();

        const formatDate = (date: Date) => {
            const year  = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day   = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 5, 1));
        const endDate   = formatDate(today);

        setFilterDashboard({ startDate, endDate });
        
        getDashboards(startDate, endDate);
    }, []);

    return (
        <div>
            <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Inicial</label>
                    <input type="date" value={filterDashboard.startDate} onChange={e => setFilterDashboard(prev => ({ ...prev, startDate: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Final</label>
                    <input type="date" value={filterDashboard.endDate} onChange={e => setFilterDashboard(prev => ({ ...prev, endDate: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-end">
                    <Button disabled={loading} onClick={handleFilter} size="sm" variant="primary">
                        {loading ? 'Filtrando...' : 'Filtrar'}
                    </Button>
                </div>
            </div>

            <div className={`grid grid-cols-12 gap-4 max-h-[calc(100dvh-13rem)] overflow-y-auto`}>
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <AccountReceivableCard data={dashboardAccountReceivableCard} />
                </div>

                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <AccountPayableCard data={dashboardAccountPayableCard} />
                </div>
                
                <div className="col-span-12 md:col-span-12 lg:col-span-6">
                    <CashFlowCard data={dashboardCashFlowCard} />
                </div>
                
                <div className="col-span-12 md:col-span-12 lg:col-span-6">
                    <EntriesExitsBar data={dashboardEntrieExitBar} />
                </div>
                <div className="col-span-12 md:col-span-12 lg:col-span-6">
                    <ExpenseCategoryPie data={dashboardExpenseCategoryPie} />
                </div>
                <div className="col-span-12 md:col-span-12 lg:col-span-6">
                    <EvolutionBalanceArea data={dashboardEvolutionBalanceArea} />
                </div>
                <div className="col-span-12 md:col-span-12 lg:col-span-6">
                    <TopRevenueBar data={dashboardTopRevenueBar} />
                </div>
            </div>
        </div>
    )
}