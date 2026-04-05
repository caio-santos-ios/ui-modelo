import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { ServiceOrderButtonCreate } from "@/components/pages/commercial/service-order/buttons/ServiceOrderButtonCreate";
// import { ServiceOrderButtonSearch } from "@/components/pages/commercial/service-order/buttons/ServiceOrderButtonSearch";
import ServiceOrderTable from "@/components/pages/commercial/service-order/ServiceOrderTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sistema de Gestão | Ordens de Serviço",
    description: "Gerenciamento de Ordens de Serviço",
};

export default function Manages() {
    return (
        <div>
            <PageBreadcrumb pageIcon="MdBuild" pageTitle="Ordem de Serviço" pageSubTitle="Ordens de Serviços" />
            <div className="flex justify-end mb-3 gap-4">
                <ServiceOrderButtonCreate />
                {/* <ServiceOrderButtonSearch /> */}
            </div>
            <ServiceOrderTable />
        </div>
    );
}
