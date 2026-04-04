"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TDashboardTopRevenueBar } from "@/types/dashboard/bars/dashboard-top-revenue-bar.type";
import { formattedMoney } from "@/utils/mask.util";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TProps = {
    data: TDashboardTopRevenueBar
}

export const TopRevenueBar = ({data}: TProps) => {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            background: "transparent",
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                barHeight: "55%",
                dataLabels: { position: "right" },
            },
        },
        colors: ["#7127A7"],
        fill: {
            type: "gradient",
            gradient: {
                type: "horizontal",
                gradientToColors: ["#C492F0"],
                stops: [0, 100],
            },
        },
        dataLabels: {
            enabled: true,
            textAnchor: "start",
            style: { fontSize: "12px", colors: ["#667085"] },
            formatter: (val) => formattedMoney(Number(val)),
            offsetX: 8,
        },
        xaxis: {
            categories: data.categories,
            labels: {
                style: { colors: "#98A2B3", fontSize: "12px" },
                formatter: (val) =>
                    new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        notation: "compact",
                    }).format(Number(val)),
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: "#667085", fontSize: "12px" },
                maxWidth: 180,
            },
        },
        grid: {
            borderColor: "#E4E7EC",
            strokeDashArray: 4,
            yaxis: { lines: { show: false } },
        },
        tooltip: {
            theme: "light",
            y: { formatter: (val) => formattedMoney(val) },
        },
    };

    const series: any = [{ name: "Receita", data: data.balances }];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 min-h-70">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Top Receitas</h3>
                </div>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    Total: {formattedMoney(data.balances.reduce((a, b) => a + b, 0))}
                </span>
            </div>
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={260}/>
        </div>
    );
};