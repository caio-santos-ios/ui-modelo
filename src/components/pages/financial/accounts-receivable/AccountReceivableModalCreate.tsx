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
import { accountReceivableAtom, accountReceivableModalAtom } from "@/jotai/financial/accounts-receivable.jotai";
import { ResetAccountReceivable, TAccountReceivable } from "@/types/financial/accounts-receivable.type";
import Checkbox from "@/components/form/input/Checkbox";
import ModalV2 from "@/components/ui/modalV2";
import { customerAtom, customerModalAtom } from "@/jotai/master-data/customer.jotai";
import { ResetCustomer } from "@/types/master-data/customer.type";

export default function AccountReceivableModalCreate() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const [modal, setModal] = useAtom(accountReceivableModalAtom);
  const [accountReceivable, setAccountReceivable] = useAtom(accountReceivableAtom);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [__, setCustomerModalCreate] = useAtom(customerModalAtom);
  const [customer, setCustomer] = useAtom(customerAtom);
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  
  const { getValues, setValue, register, reset, control, watch } = useForm<TAccountReceivable>({
    defaultValues: ResetAccountReceivable
  });


  const create = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/accounts-receivable`, { ...getValues() }, configApi());
      const result = data.result;
      resolveResponse({ status: 201, message: result.message });
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
      const { data } = await api.put(`/accounts-receivable`, { ...getValues() }, configApi());
      const result = data.result;
      resolveResponse({ status: 200, message: result.message });
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
      const { data } = await api.get(`/accounts-receivable/${id}`, configApi());
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
      const { data } = await api.get(`/payment-methods/select?deleted=false&ne$type=payable`, configApi());
      const result = data?.result?.data ?? [];
      setPaymentMethods(result);
    } catch (error) {
      resolveResponse(error);
    }
  };

  const getChartOfAccount = async () => {
    try {
      const { data } = await api.get(`/chart-of-accounts/select?deleted=false&type=receita`, configApi());
      const result = data?.result?.data ?? [];
      setChartOfAccounts(result);
    } catch (error) {
      resolveResponse(error);
    }
  };

  const getAutocompleCustomer = async (value: string) => {
    try {
      abortRef.current?.abort();

      if (!value.trim()) {
        setCustomers([]);
        return;
      }

      abortRef.current = new AbortController();

      const {data} = await api.get(`/customers?deleted=false&orderBy=tradeName&sort=desc&pageSize=10&pageNumber=1&regex$or$tradeName=${value}&regex$or$corporateName=${value}&regex$or$document=${value}`, configApi());
      const result = data.result.data?.data ?? [];
      setCustomers(result);
    } catch (error) {
      resolveResponse(error);
    }
  };

  const closeModal = () => {
    setModal(false);
    setAccountReceivable(ResetAccountReceivable);
    reset();
  };

  useEffect(() => {
    if(customer.id && customer.tradeName) {
      setValue("customerId", customer.id);
      setValue("customerName", customer.tradeName);
    };
  }, [customer]);

  useEffect(() => {
    const initial = async () => {
      reset(ResetAccountReceivable);
      setPaymentMethods([]);
      setChartOfAccounts([]);
      setCustomers([]);

      if(modal) {
        await getPaymentMethods();
        await getChartOfAccount();
        
        if (accountReceivable.id) {
          await getById(accountReceivable.id);
        }
      }
    };
    initial();
  }, [modal]);

  return (
    <ModalV2 isOpen={modal} onClose={closeModal} title="Conta a Receber" size="lg">
      <form className="flex flex-col py-4 px-4 gap-4">
          <div className={`grid grid-cols-6 gap-4 max-h-[calc(100dvh-10rem)] overflow-y-auto`}>
            <div className="col-span-6">
              <Label title="Descrição" />
              <input disabled={watch("status") != "Em Aberto"} maxLength={200} placeholder="Descrição" {...register("description")} type="text" className="input-erp-primary input-erp-default" />
            </div>
            
            <div className="col-span-6">
              <Label title="Cliente" required={false}/>
              <AutocompletePlus onAddClick={() => {
                  setCustomerModalCreate(true); 
                }} placeholder="Buscar cliente..." defaultValue={watch("customerName")} objKey="id" objValue="tradeName" onSearch={(value: string) => getAutocompleCustomer(value)} onSelect={(opt) => {
                setValue("customerId", opt.id);
                setCustomers([]);
              }} options={customers}/>
            </div>

            <div className="col-span-6 lg:col-span-4">
              <Label title="Forma de Pagamento" required={false} />
              <select disabled={watch("status") != "Em Aberto"} {...register("paymentMethodId")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800">
                  <option value="">Selecione</option>
                  {paymentMethods.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                  ))}
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
              <input
                {...register("installmentNumber", { valueAsNumber: true })}
                type="number"
                min={1}
                placeholder="1"
                className="input-erp-primary input-erp-default no-spinner"
                disabled={watch("status") != "Em Aberto"}
              />
            </div>
            <div className="col-span-6 lg:col-span-1">
              <Label title="Total de Parcelas" required={false} />
              <input
                {...register("totalInstallments", { valueAsNumber: true })}
                type="number"
                min={1}
                placeholder="1"
                className="input-erp-primary input-erp-default no-spinner"
                disabled={watch("status") != "Em Aberto"}
              />
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
                {chartOfAccounts.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option> )}
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

          <div className="flex items-center gap-3 lg:justify-end">
            <Button size="sm" variant="outline" onClick={() => closeModal()}>Cancelar</Button>
            {
              (watch("status") != "Recebido" && watch("status") != "Cancelado") &&
              (
                accountReceivable.id ? <Button size="sm" variant="primary" onClick={update}>Salvar</Button> : <Button size="sm" variant="primary" onClick={create}>Adicionar</Button>
              )
            }
          </div>
        </form>
    </ModalV2>
  );
}
