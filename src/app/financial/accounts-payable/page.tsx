import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { AccountPayableButtonCreate } from "@/components/pages/financial/account-payable/AccountPayableButtonCreate";
import AccountPayableTable from "@/components/pages/financial/account-payable/AccountPayableTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sistema de Gestão | Contas a Pagar",
    description: "Gestão de contas a pagar",
};

export default function AccountPayablePage() {
    return (
        <div>
            <PageBreadcrumb
                pageIcon="MdMoneyOff"
                pageTitle="Contas a Pagar"
                pageSubTitle="Financeiro"
            />
            <div className="flex justify-end mb-2">
                <AccountPayableButtonCreate />
            </div>
            <AccountPayableTable />
        </div>
    );
}
