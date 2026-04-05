"use client";

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { customerAtom, customerModalAtom } from "@/jotai/master-data/customer.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetCustomer, TCustomer } from "@/types/master-data/customer.type";
import { maskCNPJ, maskCPF, maskPhone } from "@/utils/mask.util";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const CustomerModalCreate = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [modal, setModal] = useAtom(customerModalAtom);
    const [customer, setCustomer] = useAtom(customerAtom);

    const { register, reset, watch, getValues } = useForm<TCustomer>({
        defaultValues: ResetCustomer
    });

    const type = watch("type");

    const closeModal = () => {
        setModal(false);
        setCustomer(ResetCustomer);
        reset(ResetCustomer);
    };

    const confirm = async (body: TCustomer) => {
        if(!body.id) {
            await create(body);
        } else {
            await update(body);
        };
    } 
        
    const create: SubmitHandler<TCustomer> = async (body: TCustomer) => {
        try {
            setLoading(true);
            const {data} = await api.post(`/customers`, body, configApi());
            resolveResponse({status: 201, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
        
    const update: SubmitHandler<TCustomer> = async (body: TCustomer) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/customers`, body, configApi());
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
            const {data} = await api.get(`/customers/${id}`, configApi());
            const result = data.result.data;
            reset(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(customer.id && modal) {
            getById(customer.id);
        };
    }, [customer.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Cliente" size="lg">
            <form className="flex flex-col p-4 md:p-6">
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6 md:col-span-2">
                        <Label title="Tipo"/>
                        <select {...register("type")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800 dark:bg-dark-900">
                            <option value="J" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Pessoa Juridica</option>
                            <option value="F" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Pessoa Física</option>
                        </select>
                    </div> 
                    <div className="col-span-6 md:col-span-4">
                        <Label title={`${type == 'J' ? 'Razão Social' : 'Nome'}`}/>
                        <input placeholder={`${type == 'J' ? 'Razão Social' : 'Nome'}`} {...register("corporateName")} type="text" className="input-erp-primary input-erp-default"/>
                    </div>
                    {
                        type == "J" && (
                            <div className="col-span-6">
                                <Label title="Nome Fantasia"/>
                                <input placeholder="Nome Fantasia" {...register("tradeName")} type="text" className="input-erp-primary input-erp-default"/>
                            </div>
                        )
                    }  
                    {
                        type == "J" ? (
                            <div className="col-span-6 md:col-span-2">
                                <Label title="CNPJ"/>
                                <input placeholder="CNPJ" onInput={(e: any) => maskCNPJ(e)} {...register("document")} type="text" className="input-erp-primary input-erp-default"/>
                            </div>

                        ) : (
                            <div className="col-span-6 md:col-span-2">
                                <Label title="CPF"/>
                                <input placeholder="CPF" onInput={(e: any) => maskCPF(e)} {...register("document")} type="text" className="input-erp-primary input-erp-default"/>
                            </div>
                        )
                    }
                    <div className="col-span-6 md:col-span-4">
                        <Label title="E-mail"/>
                        <input placeholder="E-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
                    </div>
                    <div className="col-span-6">
                        <Label title="Telefone"/>
                        <input placeholder="Telefone" onInput={(e: any) => maskPhone(e)} {...register("phone")} type="text" className="input-erp-primary input-erp-default"/>
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