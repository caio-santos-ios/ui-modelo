"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useAtom } from "jotai";
import Button from "@/components/ui/button/Button";
import { Controller, useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import AutocompletePlus from "@/components/form/AutocompletePlus";
import { ResetAccountPayable, TAccountPayable } from "@/types/financial/account-payable.type";
import Checkbox from "@/components/form/input/Checkbox";
import { TPaymentMethod } from "@/types/financial/payment-method.type";
import { accountPayableAtom, accountPayableModalAtom } from "@/jotai/financial/accounts-payable.jotai";
import ModalV2 from "@/components/ui/modalV2";
import { supplierAtom, supplierModalAtom } from "@/jotai/master-data/supplier.jotai";

export default function AccountPayableModalCreate() {
    const [_, setIsLoading] = useAtom(loadingAtom);
    const [modal, setModal] = useAtom(accountPayableModalAtom);
    const [accountPayable, setAccountPayable] = useAtom(accountPayableAtom);
    const [paymentMethods, setPaymentMethods] = useState<TPaymentMethod[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [__, setSupplierModalCreate] = useAtom(supplierModalAtom);
    const [supplier] = useAtom(supplierAtom);
    const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
    const abortRef = useRef<AbortController | null>(null);

    const { getValues, setValue, register, reset, control, watch } = useForm<TAccountPayable>({ defaultValues: ResetAccountPayable });

    const create = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.post(`/accounts-payable`, { ...getValues() }, configApi());
            resolveResponse({ status: 201, message: data.result.message });
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setIsLoading(false);
        }
    };

    const update = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.put(`/accounts-payable`, { ...getValues() }, configApi());
            resolveResponse({ status: 200, message: data.result.message });
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getById = async (id: string) => {
        try {
            setIsLoading(true);
            const { data } = await api.get(`/accounts-payable/${id}`, configApi());
            const result = data.result.data;
            reset(result);
            setValue("dueDate", result.dueDate.split("T")[0]);
            setValue("issueDate", result.issueDate.split("T")[0]);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getPaymentMethods = async () => {
        try {
            const { data } = await api.get(`/payment-methods/select?deleted=false&ne$type=receivable`, configApi());
            const result = data.result.data ?? [];
            setPaymentMethods(result);
        } catch (error) {
            resolveResponse(error);
        }
    };

    const getAutocompleSupplier = async (value: string) => {
        try {
            abortRef.current?.abort();

            if(!value) return setSuppliers([]);

            abortRef.current = new AbortController();
            
            const {data} = await api.get(`/suppliers?deleted=false&orderBy=tradeName&sort=desc&pageSize=10&pageNumber=1&regex$or$tradeName=${value}&regex$or$corporateName=${value}`, configApi());
            const result = data.result.data ?? [];
            setSuppliers(result.data);
        } catch (error) {
            resolveResponse(error);
        }
    };

    const getChartOfAccount = async () => {
        try {
            const { data } = await api.get(`/chart-of-accounts/select?deleted=false&type=despesa`, configApi());
            const result = data.result.data ?? [];
            setChartOfAccounts(result);
        } catch (error) {
            resolveResponse(error);
        }
    };

    const closeModal = () => {
        setModal(false);
        setAccountPayable(ResetAccountPayable);
        reset(ResetAccountPayable);
    };

    useEffect(() => {
        if(supplier.id && supplier.tradeName) {
        setValue("supplierId", supplier.id);
        setValue("supplierName", supplier.tradeName);
        };
    }, [supplier]);

    useEffect(() => {
        const initial = async () => {
            reset(ResetAccountPayable);
            setPaymentMethods([]);
            setChartOfAccounts([]);

            if(modal) {
                await getPaymentMethods();
                await getChartOfAccount();
    
                if (accountPayable.id) {
                    await getById(accountPayable.id);
                }
            };
        };
        initial();
    }, [modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Conta a Pagar" size="lg">
            <form className="flex flex-col py-4 px-4 gap-4">
                <div className={`grid grid-cols-6 gap-4 max-h-[calc(100dvh-10rem)] overflow-y-auto`}>
                    <div className="col-span-6">
                        <Label title="Descrição" />
                        <input disabled={watch("status") != "Em Aberto"} maxLength={100} placeholder="Descrição" {...register("description")} type="text" className="input-erp-primary input-erp-default" />
                    </div>

                    <div className="col-span-6">
                        <Label title="Fornecedor" required={false} />
                        <AutocompletePlus onAddClick={() => {
                            setSupplierModalCreate(true);
                        }} placeholder="Buscar fornecedor..." defaultValue={watch("supplierName")} objKey="id" objValue="tradeName" onSearch={(value: string) => getAutocompleSupplier(value)} onSelect={(opt) => {
                            setValue("supplierId", opt.id);
                            setSuppliers([]);
                        }} options={suppliers}/>
                    </div>

                    <div className="col-span-6 lg:col-span-4">
                        <Label title="Forma de Pagamento" required={false} />
                        <select disabled={watch("status") != "Em Aberto"} {...register("paymentMethodId")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800">
                            <option value="">Selecione</option>
                            {paymentMethods.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option> )}
                        </select>
                    </div>

                    <div className="col-span-6 lg:col-span-2">
                        <Label title="Valor" />
                        <Controller
                            disabled={watch("status") != "Em Aberto"}
                            name="amount"
                            control={control}
                            defaultValue={0}
                            render={({ field: { onChange, value } }) => (
                                <NumericFormat
                                    className="input-erp-primary input-erp-default"
                                    value={value}
                                    onValueChange={(v) => onChange(v.floatValue ?? 0)}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="R$ "
                                    decimalScale={2}
                                    fixedDecimalScale
                                    allowNegative={false}
                                    placeholder="Valor"
                                    disabled={watch("status") != "Em Aberto"}
                                />
                            )}
                        />
                    </div>

                    <div className="col-span-6 lg:col-span-1">
                        <Label title="Parcela Nº" required={false} />
                        <input disabled={watch("status") != "Em Aberto"} {...register("installmentNumber", { valueAsNumber: true })} type="number" min={1} placeholder="1" className="input-erp-primary input-erp-default no-spinner" />
                    </div>

                    <div className="col-span-6 lg:col-span-1">
                        <Label title="Total de Parcelas" required={false} />
                        <input disabled={watch("status") != "Em Aberto"} {...register("totalInstallments", { valueAsNumber: true })} type="number" min={1} placeholder="1" className="input-erp-primary input-erp-default no-spinner" />
                    </div>
                    <div className="col-span-6 lg:col-span-2">
                        <Label title="Data de Emissão" />
                        <input disabled={watch("status") != "Em Aberto"} {...register("issueDate")} type="date" className="input-erp-primary input-erp-default" />
                    </div>
                    <div className="col-span-6 lg:col-span-2">
                        <Label title="Data de Vencimento" />
                        <input disabled={watch("status") != "Em Aberto"} {...register("dueDate")} type="date" className="input-erp-primary input-erp-default" />
                    </div>
                    <div className="col-span-6">
                        <Label title="Plano de Contas" required={false} />
                        <select disabled={watch("status") != "Em Aberto"} {...register("chartOfAccountId")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800">
                            <option value="">Selecione</option>
                            {chartOfAccounts.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="col-span-6 lg:col-span-2">
                        <Label title="Tem recorrência?" required={false} />
                        <Checkbox disabled={watch("status") != "Em Aberto"} label={watch("isRecurrent") ? 'Recorrente' : 'Não Recorrente'} checked={watch("isRecurrent")} onChange={(e) => {
                            setValue("isRecurrent", e);
                        }} />
                    </div>

                    {watch("isRecurrent") && (
                        <div className="col-span-6 lg:col-span-4">
                            <Label title="Periodo de recorrência" required={false} />
                            <select disabled={watch("status") != "Em Aberto"} {...register("typeRecurrent")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800">
                                <option value="">Selecione</option>
                                <option value="daily">Diário</option>
                                <option value="weekly">Semanal</option>
                                <option value="biweekly">Quinzenal</option>
                                <option value="monthly">Mensal</option>
                                <option value="quarterly">Trimestral</option>
                                <option value="semiannual">Semestral</option>
                                <option value="annual">Anual</option>
                            </select>
                        </div>
                    )}
                    <div className="col-span-6">
                        <Label title="Observações" required={false}/>
                        <textarea disabled={watch("status") != "Em Aberto"} maxLength={500} placeholder="Observações" {...register("notes")} rows={3} className="input-erp-primary input-erp-default resize-none" />
                    </div>
                </div>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    {
                        (watch("status") != "Pago" && watch("status") != "Cancelado") &&
                        (accountPayable.id ? <Button size="sm" variant="primary" onClick={update}>Salvar</Button> : <Button size="sm" variant="primary" onClick={create}>Adicionar</Button>)
                    }
                </div>
            </form>
        </ModalV2>
    );
}
