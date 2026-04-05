"use client";

import AutocompletePlus from "@/components/form/AutocompletePlus";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { serviceOrderAtom, serviceOrderModalAtom } from "@/jotai/commercial/service-order.jotai";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { customerAtom, customerModalAtom } from "@/jotai/master-data/customer.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetServiceOrder, TServiceOrder } from "@/types/commercial/sales-order.type";
import { TCustomer } from "@/types/master-data/customer.type";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const ServiceOrderModalCreate = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [modal, setModal] = useAtom(serviceOrderModalAtom);
    const [serviceOrder, setServiceOrder] = useAtom(serviceOrderAtom);
    const [__, setCustomerModalCreate] = useAtom(customerModalAtom);
    const [customer, setCustomer] = useAtom(customerAtom);
    const [customers, setCustomers] = useState<TCustomer[]>([]);
    const router = useRouter();
    
    const { register, reset, watch, getValues, setValue } = useForm<TServiceOrder>({
        defaultValues: ResetServiceOrder
    });

    const closeModal = () => {
        setModal(false);
        setServiceOrder(ResetServiceOrder);
        reset(ResetServiceOrder);
    };

    const confirm = async (body: TServiceOrder) => {
        if(!body.id) {
            await create(body);
        } else {
            await update(body);
        };
    } 
        
    const create: SubmitHandler<TServiceOrder> = async (body: TServiceOrder) => {
        try {
            setLoading(true);
            const {data} = await api.post(`/service-orders`, body, configApi());
            const result = data.result.data ?? ResetServiceOrder;
            resolveResponse({status: 201, message: data.result.message});
            closeModal();
            router.push(`/commercials/service-orders/${result.id}`);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
        
    const update: SubmitHandler<TServiceOrder> = async (body: TServiceOrder) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/service-orders`, body, configApi());
            resolveResponse({status: 200, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getById = async (id: string) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/service-orders/${id}`, configApi());
            const result = data.result.data;
            reset(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getAutocompleCustomer = async (value: string) => {
        try {
        if(!value) return setCustomers([]);
            const {data} = await api.get(`/customers?deleted=false&orderBy=tradeName&sort=desc&pageSize=10&pageNumber=1&regex$or$tradeName=${value}&regex$or$corporateName=${value}&regex$or$document=${value}`, configApi());
            const result = data.result;
            setCustomers(result.data);
        } catch (error) {
            resolveResponse(error);
        }
    };

    useEffect(() => {
        if(serviceOrder.id && modal) {
            getById(serviceOrder.id);
        };
    }, [serviceOrder.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Ordem de Serviço" size="lg">
            <form className="flex flex-col p-4 md:p-6 gap-4">
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6">
                        <Label title="Cliente"/>
                        <AutocompletePlus onAddClick={() => {
                            setCustomerModalCreate(true); 
                            }} placeholder="Buscar cliente..." defaultValue={watch("customerName")} objKey="id" objValue="tradeName" onSearch={(value: string) => getAutocompleCustomer(value)} onSelect={(opt) => {
                            setValue("customerId", opt.id);
                        }} options={customers}/>
                    </div> 
                    <div className="col-span-3 md:col-span-2">
                        <Label title="Data de Abertura"/>
                        <input {...register("openingDate")} type="date" className="input-erp-primary input-erp-default" />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                        <Label title="Previsão de Entrega"/>
                        <input {...register("forecasDate")} type="date" className="input-erp-primary input-erp-default" />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                        <Label title="Prioridade"/>
                        <select {...register("priority")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800">
                            <option value="Baixa">Baixa</option>
                            <option value="Normal">Normal</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </div>
                    <div className="col-span-6">
                        <Label title="Descrição"/>
                        <TextArea rows={5} placeholder="Descrição" value={watch("description")} onChange={(e) => {setValue("description", e)}} />
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Salvar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}