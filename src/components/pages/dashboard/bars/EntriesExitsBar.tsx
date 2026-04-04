"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TDashboardEntrieExitBar } from "@/types/dashboard/bars/dashboard-entrie-exit-bar.type";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const mockData = {
    categories: ["Nov/24", "Dez/24", "Jan/25", "Fev/25", "Mar/25", "Abr/25"],
    entradas:   [4200, 6800, 5100, 7300, 8000, 6500],
    saidas:     [2800, 3200, 4100, 2900, 3500, 3000],
};

type TProps = {
    data: TDashboardEntrieExitBar
}

export const EntriesExitsBar = ({data}: TProps) => {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            background: "transparent",
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: "55%",
                dataLabels: { position: "top" },
            },
        },
        dataLabels: { enabled: false },
        colors: ["#7127A7", "#F04438"],
        xaxis: {
            categories: data.categories,
            labels: {
                style: { colors: "#98A2B3", fontSize: "12px" },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: "#98A2B3", fontSize: "12px" },
                formatter: (val) =>
                    new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        notation: "compact",
                    }).format(val),
            },
        },
        grid: {
            borderColor: "#E4E7EC",
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
            labels: { colors: "#667085" },
            markers: { size: 8 },
        },
        tooltip: {
            theme: "light",
            y: {
                formatter: (val) =>
                    new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(val),
            },
        },
    };

    const series = [
        { name: "Entradas", data: data.entries },
        { name: "Saídas",   data: data.exits   },
    ];
    
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 min-h-80">
            <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Entradas vs Saídas
                </h3>
            </div>
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={280}
            />
        </div>
    );
}