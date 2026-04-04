"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TDashboardEvolutionBalanceArea } from "@/types/dashboard/area/dashboard-evolution-balance-area.type";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const data = {
    categories: ["Nov/24", "Dez/24", "Jan/25", "Fev/25", "Mar/25", "Abr/25"],
    balances:      [1400, 5000, 1900, 6300, 10800, 14300],
};

type TProps = {
    data: TDashboardEvolutionBalanceArea
}
export const EvolutionBalanceArea = ({data}: TProps) => {
    const options: ApexOptions = {
        chart: {
            type: "area",
            toolbar: { show: false },
            background: "transparent",
            fontFamily: "inherit",
            sparkline: { enabled: false },
        },
        stroke: {
            curve: "smooth",
            width: 2.5,
        },
        colors: ["#7127A7"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.02,
                stops: [0, 100],
            },
        },
        dataLabels: { enabled: false },
        markers: {
            size: 4,
            colors: ["#7127A7"],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: { size: 6 },
        },
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

    const series = [{ name: "Saldo", data: data.balances }];

    const balancesAtual = data.balances[data.balances.length - 1];
    const balancesAnterior = data.balances[data.balances.length - 2];
    const variacao = ((balancesAtual - balancesAnterior) / balancesAnterior) * 100;
    const positivo = variacao >= 0;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Evolução do Saldo
                    </h3>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                        {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(balancesAtual)}
                    </p>
                    <span
                        className={`text-xs font-medium ${
                            positivo
                                ? "text-success-600 dark:text-success-400"
                                : "text-error-600 dark:text-error-400"
                        }`}
                    >
                        {positivo ? "▲" : "▼"} {Math.abs(variacao).toFixed(1)}% vs mês anterior
                    </span>
                </div>
            </div>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={250}
            />
        </div>
    );
};