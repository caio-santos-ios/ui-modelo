"use client";

import Button from "@/components/ui/button/Button";
import { filterDashboardAtom, searchFilterDashboardAtom } from "@/jotai/dashboard/filter-dashboard.jotai";
import { useAtom } from "jotai";

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