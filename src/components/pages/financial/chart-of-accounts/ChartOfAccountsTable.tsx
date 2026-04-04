"use client";

import { useEffect, useState } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import Badge from "@/components/ui/badge/Badge";
import { useAtom } from "jotai";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { NotData } from "@/components/not-data/NotData";
import { useModal } from "@/hooks/useModal";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import ChartOfAccountsModalCreate from "./ChartOfAccountsModalCreate";
import { chartOfAccountAtom, chartOfAccountModalAtom } from "@/jotai/financial/chart-of-account.jotai";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";

const columns: TDataTableColumns[] = [
  {title: "Código",           label: "code",       type: "text"},
  {title: "Nome",             label: "name",       type: "text"},
  {title: "Tipo",             label: "type",       type: "text"},
  {title: "Grupo DRE",        label: "groupDRE",   type: "text"},
  {title: "Data de Criação",  label: "createdAt",  type: "date"},
];

const module = "D";
const routine = "D4";

export default function ChartOfAccountsTable() {
  const [pagination, setPagination] = useAtom(paginationAtom);
  const [_, setLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalCreate, setModalCreate] = useAtom(chartOfAccountModalAtom);
  const [chartOfAccount, setChartOfAccount] = useAtom(chartOfAccountAtom);
  const [groupsDespesaDRE] = useState<any[]>([
    { value: "none", level: 1, label: "Não mostrar no DRE" },    
    { value: "deducoes", level: 1, label: "Deduções" },
    { value: "imp_vendas", level: 2, label: "Impostos sobre vendas" },
    { value: "com_vendas", level: 2, label: "Comissões sobre vendas" },
    { value: "dev_vendas", level: 2, label: "Devolução de vendas" },    
    { value: "custos", level: 1, label: "Custos operacionais" },
    { value: "cpv", level: 2, label: "Custo dos produtos vendidos" },    
    { value: "desp_op", level: 1, label: "Despesas operacionais" },
    { value: "desp_adm", level: 2, label: "Despesas administrativas" },
    { value: "desp_ger", level: 2, label: "Despesas operacionais" },
    { value: "desp_com", level: 2, label: "Despesas comerciais" },    
    { value: "desp_fin", level: 1, label: "Despesas financeiras" },
    { value: "emp_div", level: 2, label: "Empréstimos e dívidas" },
    { value: "jur_mul", level: 2, label: "Juros/multas pagos" },
    { value: "desc_conc", level: 2, label: "Descontos concedidos" },
    { value: "tax_ban", level: 2, label: "Taxas/tarifas bancárias" },    
    { value: "outras", level: 1, label: "Outras despesas" },
    { value: "outras_esp", level: 2, label: "Outras despesas" },
  ]);
  const [groupsReceitaDRE] = useState<any[]>([
    { type: "dre", value: "rec_bruta", level: 1, label: "Receita bruta" },
    { type: "dre", value: "rec_vendas", level: 2, label: "Receitas de vendas" },    
    { type: "dre", value: "rec_fin", level: 1, label: "Receitas financeiras" },
    { type: "dre", value: "rend_fin", level: 2, label: "Rendimentos financeiros" },
    { type: "dre", value: "jur_rec", level: 2, label: "Juros/multas recebidos" },
    { type: "dre", value: "desc_rec", level: 2, label: "Descontos recebidos" },
    { type: "dre", value: "rec_outras", level: 1, label: "Outras receitas" },
    { type: "dre", value: "outras_rec_item", level: 2, label: "Outras receitas" },
  ]);

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/chart-of-accounts?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
      const result = data.result.data;
      
      setPagination({
        currentPage: result.currentPage,
        data: result.data.map((x: any) => ({...x, type: getTypeBadge(x.type), groupDRE: getDescriptionGroupDRE(x.groupDRE, x.type)})) ?? [],
        sizePage: result.pageSize,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      });
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const destroy = async () => {
    try {
      setLoading(true);
      await api.delete(`/chart-of-accounts/${chartOfAccount.id}`, configApi());
      resolveResponse({ status: 204, message: "Excluído com sucesso" });
      closeModal();
      await getAll(pagination.currentPage);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const changePage = async (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    await getAll(page);
  };

  const getObj = (obj: any, action: string) => {
    setChartOfAccount(obj);

    if (action === "edit") setModalCreate(true);
    if (action === "delete") openModal();
  };

  const getTypeBadge = (type: string) => {
    if (type === "receita") return <Badge color="success" size="sm">Recebimento</Badge>;
    if (type === "despesa") return <Badge color="error" size="sm">Pagamento</Badge>;
    if (type === "custo") return <Badge color="warning" size="sm">Custo</Badge>;
    return <Badge size="sm">{type}</Badge>;
  };

  const getDescriptionGroupDRE = (group: string, type: string) => {
    if (type === "despesa") {
      return groupsDespesaDRE.find(g => g.value === group)?.label || group;
    }
    if (type === "receita") {
      return groupsReceitaDRE.find(g => g.value === group)?.label || group;
    }
  }
  
  useEffect(() => {
    if (permissionRead(module, routine)) {
      getAll(1);
    }
  }, [modalCreate]);

  return (
    <div>
      {
        pagination.data.length > 0 ? 
        <DataTableCard isActions={permissionUpdate(module, routine) || permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
          <>
            {
              permissionUpdate(module, routine) &&
              <IconEdit action="edit" obj={obj} getObj={getObj}/>
            }
            {
              permissionDelete(module, routine) &&
              <IconDelete action="delete" obj={obj} getObj={getObj}/>
            }
          </>
        )
        }/>
        :
        <NotData />
      }
      <ChartOfAccountsModalCreate />
      <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Plano de Contas" />          
    </div>
  );
}