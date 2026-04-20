"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ServiceOrderItemsTab from "./tabs/ServiceOrderItemsTab";
import ServiceOrderCloseModal from "./modals/ServiceOrderCloseModal";
import { CustomerModalCreate } from "../../master-data/customer/CustomerModalCreate";
import { SupplierModalCreate } from "../../master-data/supplier/SupplierModalCreate";
import { ResetCustomer } from "@/types/master-data/customer.type";
import { customerAtom } from "@/jotai/master-data/customer.jotai";
import ServiceOrderDataTab from "./tabs/ServiceOrderDataTab";
import { ResetServiceOrder, TServiceOrder } from "@/types/commercial/sales-order.type";
import ServiceOrderAttachmentsTab from "./tabs/ServiceOrderAttachmentsTab";

type TProp = { id?: string };

const TABS = [
  { key: "data",        title: "Dados Gerais" },
  { key: "items",       title: "Peças e Serviços" },
  { key: "attachments", title: "Anexos" }
];

export default function ServiceOrderForm({ id }: TProp) {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const [currentTab, setCurrentTab] = useState("data");
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [__, setCustomer] = useAtom(customerAtom);

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

  useEffect(() => {
    setCustomer(ResetCustomer);
    if (isEdit) {
      getById(id!);
    } 
  }, []);

  return (
    <>
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
          <ServiceOrderItemsTab serviceOrderId={id!}/>
        )}
        
        {currentTab === "attachments" && isEdit && (
          <ServiceOrderAttachmentsTab serviceOrderId={id!}/>
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
