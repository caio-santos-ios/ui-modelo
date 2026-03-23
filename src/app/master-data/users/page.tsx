import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import UserTable from "@/components/pages/master-data/user/UserTable";
import Button from "@/components/ui/button/Button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Telemovvi | Usuários",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function User() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdPeople" pageTitle="Usuários" pageSubTitle="Cadastros" />
      <div className="flex justify-end mb-2">
        <Link href="users/create">
          <Button type="submit" className="" size="sm">Adicionar</Button>
        </Link>
      </div>
      <UserTable />
    </div>
  );
}