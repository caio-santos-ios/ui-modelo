import { Dashboard } from "@/components/pages/dashboard/dashboard/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Gestão | Dashboard",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function DashboardPage() {
  return <Dashboard /> 
}