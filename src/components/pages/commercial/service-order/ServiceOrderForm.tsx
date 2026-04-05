"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ServiceOrderItemsTab from "./tabs/ServiceOrderItemsTab";
import ServiceOrderCloseModal from "./modals/ServiceOrderCloseModal";
import { useRouter } from "next/navigation";
import { CustomerModalCreate } from "../../master-data/customer/CustomerModalCreate";
import { SupplierModalCreate } from "../../master-data/supplier/SupplierModalCreate";
import { ResetCustomer } from "@/types/master-data/customer.type";
import { customerAtom } from "@/jotai/master-data/customer.jotai";
import ServiceOrderDataTab from "./tabs/ServiceOrderDataTab";
import { ResetServiceOrder, TServiceOrder } from "@/types/commercial/sales-order.type";

type TProp = { id?: string };

const TABS = [
  { key: "data", title: "Dados Gerais" },
  { key: "items", title: "Peças e Serviços" }
];

export default function ServiceOrderForm({ id }: TProp) {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const [currentTab, setCurrentTab] = useState("data");
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [warrantyInfo, setWarrantyInfo] = useState<any>(null);
  const [__, setCustomer] = useAtom(customerAtom);
  const router = useRouter();

  const { reset, watch, getValues, setValue, register } = useForm<TServiceOrder>({
    defaultValues: ResetServiceOrder
  });

  const isEdit = id && id !== "create";

  const getById = async (id: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/service-orders/${id}`, configApi());
      const result = data.result.data;
      reset({...result, openingDate: result.openingDate.split("T")[0], forecasDate: result.forecasDate.split("T")[0]});
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEquipment = async () => {
    const body = getValues();

    try {
      setIsLoading(true);
      if (!isEdit) {
        const userId = localStorage.getItem("userId") || "";
        const payload = {
          customerId: body.customerId,
          openedByUserId: userId,
          createdBy: userId,
          priority: body.priority,
        };
        const { data } = await api.post("/service-orders", payload, configApi());
        const result = data.result;
        resolveResponse({ status: 201, message: result.message });
        router.push(`/order-services/manages/${result.data.id}`);
      } else {
        const payload = {
          id: body.id,
          customerId: body.customerId,
          status: body.status,
          priority: body.priority,
        };
        const { data } = await api.put("/service-orders", payload, configApi());
        const result = data.result;
        resolveResponse({ status: 200, message: result.message });
      }
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!isEdit) return;
    setValue("status", newStatus);
    await saveEquipment();
    await getById(id);
  };

  useEffect(() => {
    setCustomer(ResetCustomer);
    if (isEdit) {
      getById(id!);
    } 
  }, []);

  return (
    <>
      {warrantyInfo && (
        <div className="mb-4 p-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-300">
          ⚠ <strong>OS em Garantia!</strong> Encontrada OS anterior dentro do período de garantia (até {warrantyInfo.warrantyUntil ? new Date(warrantyInfo.warrantyUntil).toLocaleDateString("pt-BR") : "—"}). Financeiro bloqueado automaticamente.
        </div>
      )}

      <div className="flex items-center font-medium gap-2 rounded-lg transition px-2 py-2 text-sm border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 mb-3 text-gray-700 dark:text-gray-400">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={`${currentTab === tab.key ? "bg-brand-500 text-white" : ""} px-3 py-1 rounded-md transition-colors`}>
            {tab.title}
          </button>
        ))}
      </div>

      <div className="mb-2">
        {currentTab === "data" && (
          <ServiceOrderDataTab
            register={register}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
          />
        )}
        {currentTab === "items" && isEdit && (
          <ServiceOrderItemsTab
            serviceOrderId={id!}/>
        )}
        {currentTab === "items" && !isEdit && (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
            Salve o equipamento primeiro para adicionar peças e serviços.
          </div>
        )}
        {currentTab === "laudo" && !isEdit && (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
            Salve o equipamento primeiro para preencher o laudo.
          </div>
        )}
      </div>

      {showCloseModal && isEdit && (
        <ServiceOrderCloseModal
          serviceOrderId={id!}
          onClose={() => setShowCloseModal(false)}
          onSuccess={() => { setShowCloseModal(false); getById(id!); }}
        />
      )}

      <CustomerModalCreate />
      <SupplierModalCreate />
    </>
  );
}
