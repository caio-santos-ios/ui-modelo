"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useAtom } from "jotai";
import Button from "@/components/ui/button/Button";
import { useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import { useEffect } from "react";
import { chartOfAccountAtom, chartOfAccountModalAtom } from "@/jotai/financial/chart-of-account.jotai";
import { ResetChartOfAccounts, TChartOfAccounts } from "@/types/financial/chartofaccounts.type";
import ModalV2 from "@/components/ui/modalV2";

const accounts: {type: "despesa" | "receita", value: string,   level: number, label: string}[] = [
  {type: "despesa", value: "1",   level: 1, label: "1 - Pagamentos"},
  {type: "despesa", value: "1.1", level: 2, label: "1.1 - Despesas administrativas e comerciais" },
  {type: "despesa", value: "1.2", level: 2, label: "1.2 - Despesas de produtos vendidos" },
  {type: "despesa", value: "1.3", level: 2, label: "1.3 - Despesas financeiras" },
  {type: "despesa", value: "1.4", level: 2, label: "1.4 - Investimentos" },
  {type: "despesa", value: "1.5", level: 2, label: "1.5 - Outras despesas" },
  {type: "receita",  value: "2",   level: 1, label: "2 - Recebimentos"},
  {type: "receita", value: "2.1", level: 2, label: "2.1 - Receitas de vendas" },
  {type: "receita", value: "2.2", level: 2, label: "2.2 - Receitas financeiras" },
  {type: "receita", value: "2.3", level: 2, label: "2.3 - Outras receitas" }
];

const groupsDespesaDRE: {value: string, level: number, label: string}[] = [
  { value: "none", level: 1, label: "Não mostrar no DRE" },    
  { value: "deducoes", level: 1, label: "Deduções" },
  { value: "imp_vendas", level: 2, label: "(-) Impostos sobre vendas" },
  { value: "com_vendas", level: 2, label: "(-) Comissões sobre vendas" },
  { value: "dev_vendas", level: 2, label: "(-) Devolução de vendas" },    
  { value: "custos", level: 1, label: "Custos operacionais" },
  { value: "cpv", level: 2, label: "(-) Custo dos produtos vendidos" },    
  { value: "desp_op", level: 1, label: "Despesas operacionais" },
  { value: "desp_adm", level: 2, label: "(-) Despesas administrativas" },
  { value: "desp_ger", level: 2, label: "(-) Despesas operacionais" },
  { value: "desp_com", level: 2, label: "(-) Despesas comerciais" },    
  { value: "desp_fin", level: 1, label: "Despesas financeiras" },
  { value: "emp_div", level: 2, label: "(-) Empréstimos e dívidas" },
  { value: "jur_mul", level: 2, label: "(-) Juros/multas pagos" },
  { value: "desc_conc", level: 2, label: "(-) Descontos concedidos" },
  { value: "tax_ban", level: 2, label: "(-) Taxas/tarifas bancárias" },    
  { value: "outras", level: 1, label: "Outras despesas" },
  { value: "outras_esp", level: 2, label: "(-) Outras despesas" },
];

const groupsReceitaDRE: {value: string, level: number, label: string}[] = [
  { value: "rec_bruta", level: 1, label: "Receita bruta" },
  { value: "rec_vendas", level: 2, label: "(+) Receitas de vendas" },    
  { value: "rec_fin", level: 1, label: "Receitas financeiras" },
  { value: "rend_fin", level: 2, label: "(+) Rendimentos financeiros" },
  { value: "jur_rec", level: 2, label: "(+) Juros/multas recebidos" },
  { value: "desc_rec", level: 2, label: "(+) Descontos recebidos" },
  { value: "rec_outras", level: 1, label: "Outras receitas" },
  { value: "outras_rec_item", level: 2, label: "(+) Outras receitas" },
];

export default function ChartOfAccountsModalCreate() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const [modal, setModalCreate] = useAtom(chartOfAccountModalAtom);
  const [chartOfAccount, setChartOfAccount] = useAtom(chartOfAccountAtom);

  const { getValues, setValue, register, reset, watch } = useForm<TChartOfAccounts>({
    defaultValues: ResetChartOfAccounts
  });

  const create = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/chart-of-accounts`, { ...getValues() }, configApi());
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
      const { data } = await api.put(`/chart-of-accounts`, { ...getValues() }, configApi());
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
      const { data } = await api.get(`/chart-of-accounts/${id}`, configApi());
      const result = data.result.data;
      reset(result);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalCreate(false);
    setChartOfAccount(ResetChartOfAccounts);
    reset(ResetChartOfAccounts);
  };

  useEffect(() => {
    const initial = async () => {

      if(modal) {        
        if (chartOfAccount.id) {
          await getById(chartOfAccount.id);
        }
      }
    };
    initial();
  }, [modal]);

  return (
    <ModalV2 isOpen={modal} onClose={closeModal} title="Plano de Conta" size="lg">
      <form className="flex flex-col py-4 px-4 gap-4">
        <div className={`grid grid-cols-6 gap-4 max-h-[calc(100dvh-10rem)] overflow-y-auto`}>
          <div className="col-span-6">
            <Label title="Nome" />
            <input maxLength={200} placeholder="Nome" {...register("name")} type="text" className="input-erp-primary input-erp-default" />
          </div>
          <div className="col-span-6 lg:col-span-3">
            <Label title="Conta Mãe" required={false} />
            <select {...register("account")} onChange={(e) => {
              setValue("groupDRE", "");

              const account = accounts.find(x => x.value == e.target.value);
              if(account) {
                setValue("type", account.type);
              }
            }} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800">
              <option value="">Selecione</option>
              {accounts.map((p: any) => <option className={`${p.level > 1 ? '' : 'text-gray-500'}`} key={p.value} value={p.value}>{p.label}</option> )}
            </select>
          </div>
          <div className="col-span-6 lg:col-span-3">
            <Label title="Grupo de DRE" required={false} />
            {
              watch("type") === "receita" ? 
              <select {...register("groupDRE")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800">
                <option value="">Selecione</option>
                {groupsReceitaDRE.map((p: any) => (
                  <option className={`${p.level > 1 ? '' : 'text-gray-500'}`} key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              :
              <select {...register("groupDRE")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800">
                <option value="">Selecione</option>
                {groupsDespesaDRE.map((p: any) => (
                  <option className={`${p.level > 1 ? '' : 'text-gray-500'}`} key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            }
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
          {
            chartOfAccount.id ? <Button size="sm" variant="primary" onClick={update}>Salvar</Button> : <Button size="sm" variant="primary" onClick={create}>Adicionar</Button> 
          }
        </div>
      </form>
    </ModalV2>
  );
}
