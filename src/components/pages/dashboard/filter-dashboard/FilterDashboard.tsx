"use client";

import Button from "@/components/ui/button/Button";
import { filterDashboardAtom, searchFilterDashboardAtom } from "@/jotai/dashboard/filter-dashboard.jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const FilterDashboard = () => {
    const [filterDashboard, setFilterDashboard] = useAtom(filterDashboardAtom);
    const [search, setSearch] = useAtom(searchFilterDashboardAtom);

    const handleFilter = () => {
        setFilterDashboard({
            startDate: filterDashboard.startDate,
            endDate: filterDashboard.endDate,
        });
        setSearch(!search);
    };

    useEffect(() => {
        const today = new Date();

        const formatDate = (date: any) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        const endDate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
        setFilterDashboard({
            startDate: startDate,
            endDate: endDate
        });
    }, []);

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Inicial</label>
                <input type="date" value={filterDashboard.startDate} onChange={e => setFilterDashboard(prev => ({ ...prev, startDate: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Final</label>
                <input type="date" value={filterDashboard.endDate} onChange={e => setFilterDashboard(prev => ({ ...prev, endDate: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-end">
                <Button onClick={handleFilter} size="sm" variant="primary">Filtrar</Button>
            </div>
        </div>
    )
}