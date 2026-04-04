"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const mockData = {
    categorias: [
        "Manutenção e Suporte",
        "Licenciamento de Software",
        "Consultoria",
        "Desenvolvimento de Sistema",
        "Implantação",
    ],
    valores: [1800, 2400, 3200, 5500, 7800],
};

const fmt = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export const TopReceitasChart = () => {
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
            formatter: (val) => fmt(Number(val)),
            offsetX: 8,
        },
        xaxis: {
            categories: mockData.categorias,
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
            y: { formatter: (val) => fmt(val) },
        },
    };

    const series = [{ name: "Receita", data: mockData.valores }];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Top Receitas
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Por categoria no período
                    </p>
                </div>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    Total: {fmt(mockData.valores.reduce((a, b) => a + b, 0))}
                </span>
            </div>
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={260}
            />
        </div>
    );
};