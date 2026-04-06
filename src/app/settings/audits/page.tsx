import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import AuditTable from "@/components/pages/settings/audit/AuditTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Gestão | Auditoria",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function LoggerPage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdArchive" pageTitle="Auditoria" pageSubTitle="Configurações" />
      <AuditTable />
    </div>
  );
}