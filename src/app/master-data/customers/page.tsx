import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { CustomerButtonCreate } from "@/components/pages/master-data/customer/CustomerButtonCreate";
import CustomerTable from "@/components/pages/master-data/customer/CustomerTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Gestão | Clientes",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function CustomerPage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdPerson" pageTitle="Clientes" pageSubTitle="Cadastros" />
      <div className="flex justify-end mb-2">
        <CustomerButtonCreate />
      </div>
      <CustomerTable />
    </div>
  );
}