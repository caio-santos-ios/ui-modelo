"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TDashboardExpenseCategoryPie } from "@/types/dashboard/pie/dashboard-expense-category-pie.type";
import { formattedMoney } from "@/utils/mask.util";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });


type TProps = {
    data: TDashboardExpenseCategoryPie
}

export const ExpenseCategoryPie = ({data}: TProps) => {
    const options: ApexOptions = {
        chart: {
            type: "donut",
            background: "transparent",
            fontFamily: "inherit",
        },
        labels: data.labels,
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
                            formatter: () => formattedMoney(data.total),
                        },
                        value: {
                            show: true,
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#101828",
                            formatter: (val) => formattedMoney(Number(val)),
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
            y: { formatter: (val) => formattedMoney(val) },
        },
        stroke: { width: 0 },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-5 min-h-80">
            <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Despesas por Categoria</h3>
            </div>
            <ReactApexChart
                options={options}
                series={data.values}
                type="donut"
                height={300}
            />
        </div>
    );
};