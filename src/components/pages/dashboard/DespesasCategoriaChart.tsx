"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const mockData = {
    labels:  ["Servidor/Hospedagem", "Internet/WiFi", "Banco de Dados", "Plataforma Freelancer", "Outras"],
    valores: [1200, 300, 450, 800, 250],
};

const fmt = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

const total = mockData.valores.reduce((a, b) => a + b, 0);

export const DespesasCategoriaChart = () => {
    const options: ApexOptions = {
        chart: {
            type: "donut",
            background: "transparent",
            fontFamily: "inherit",
        },
        labels: mockData.labels,
        colors: ["#7127A7", "#A862DC", "#C492F0", "#DBBFFF", "#F5EBFF"],
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: "72%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total",
                            fontSize: "13px",
                            color: "#667085",
                            formatter: () => fmt(total),
                        },
                        value: {
                            show: true,
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#101828",
                            formatter: (val) => fmt(Number(val)),
                        },
                    },
                },
            },
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            labels: { colors: "#667085" },
            markers: { size: 8 },
            itemMargin: { horizontal: 8, vertical: 4 },
        },
        tooltip: {
            y: { formatter: (val) => fmt(val) },
        },
        stroke: { width: 0 },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
            <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Despesas por Categoria
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Distribuição do mês atual
                </p>
            </div>
            <ReactApexChart
                options={options}
                series={mockData.valores}
                type="donut"
                height={300}
            />
        </div>
    );
};