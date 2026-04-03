import SignUpForm from "@/components/auth/SignUpForm";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import BillingCard from "@/components/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { AccountReceivableCard } from "@/components/pages/dashboard/account-payable-card/AccountReceivableCard";
import { FilterDashboard } from "@/components/pages/dashboard/filter-dashboard/FilterDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Gestão | Dashboard",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function DashboardPage() {
  return (
    <div className={`grid grid-cols-12 gap-4 max-h-[calc(100dvh-8rem)] overflow-y-auto px-2`}>
      <div className="col-span-12">
        <FilterDashboard />
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-3">
        <AccountReceivableCard />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <BillingCard />
      </div>
      
      <div className="col-span-12 xl:col-span-6">
        <MonthlySalesChart />
      </div>
      <div className="col-span-12 xl:col-span-6">
        <RecentOrders />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>
    </div>
  ) 
}