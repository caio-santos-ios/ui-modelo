"use client";

import Button from "@/components/ui/button/Button";
import { filterDashboardAtom, searchFilterDashboardAtom } from "@/jotai/dashboard/filter-dashboard.jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export const FilterDashboard = () => {
    const [filterDashboard, setFilterDashboard] = useAtom(filterDashboardAtom);
    const [search, setSearch] = useAtom(searchFilterDashboardAtom);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const today = new Date();

        const formatDate = (date: any) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const firstDay = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        const lastDay = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));

        setFilterDashboard({ startDate: firstDay, endDate: lastDay });

        console.log(firstDay);
        console.log(lastDay);
    }, []);

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Inicial</label>
                <input type="date" value={filterDashboard.startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Final</label>
                <input type="date" value={filterDashboard.endDate} onChange={e => setEndDate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-end">
                <Button onClick={() => setSearch(!search)} size="sm" variant="primary">Filtrar</Button>
            </div>
        </div>
    )
}