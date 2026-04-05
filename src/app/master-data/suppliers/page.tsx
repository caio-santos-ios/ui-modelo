import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { SupplierButtonCreate } from "@/components/pages/master-data/supplier/SupplierButtonCreate";
import SupplierTable from "@/components/pages/master-data/supplier/SupplierTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Gestão | Fornecedores",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function SupplierPage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdLocalShipping" pageTitle="Fornecedores" pageSubTitle="Cadastros" />
      <div className="flex justify-end mb-2">
        <SupplierButtonCreate />
      </div>
      <SupplierTable />
    </div>
  );
}