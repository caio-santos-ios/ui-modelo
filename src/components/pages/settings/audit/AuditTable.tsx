"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionRead } from "@/utils/permission.util";
import { NotData } from "@/components/not-data/NotData";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { AuditModalSearch } from "./AuditModalSearch";
import { TPagination } from "@/types/global/pagination.type";

const columns: TDataTableColumns[] = [
  { title: "Metodo", label: "method", type: "text" },
  { title: "Rota", label: "path", type: "text" },
  { title: "Mensagem", label: "message", type: "text" },
  { title: "Status", label: "statusCode", type: "text" },
  { title: "Data de Criação", label: "createdAt", type: "dateTime" },
  { title: "Usuário", label: "userName", type: "text" },
  { title: "Tempo Segundos", label: "time", type: "int" },
]

const module = "A";
const routine = "A4";

export default function AuditTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);

  const getAll = async (pag: TPagination) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/loggers?${pagination.query}&audit=true&orderBy=${pag.orderBy}&sort=${pag.sort}&pageSize=${pag.sizePage}&pageNumber=${pag.currentPage}`, configApi());
      const result = data.result;

      setPagination(pag => ({
        ...pag,
        currentPage: result.currentPage,
        data: result.data,
        sizePage: result.pageSize,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        query: pag.query
      }));
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const changePage = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));

    await getAll({ ...pagination, currentPage: page });
  };

  const changeOrderBy = async (orderBy: string) => {
    const orderBySort = orderBy.split(" ");

    setPagination(pag => ({
      ...pag,
      orderBy: orderBySort[0],
      sort: orderBySort[1]
    }));

    await getAll({ ...pagination, orderBy: orderBySort[0], sort: orderBySort[1] });
  };

  useEffect(() => {
    if (permissionRead(module, routine)) {
      getAll(pagination);
    };
  }, [pagination.query]);

  return (
    <div>
      {
        pagination.data.length > 0 ?
          <DataTableCard heightContainer="max-h-[calc(100dvh-14rem)] md:max-h-[calc(100dvh-14rem)]" pagination={pagination} columns={columns} changePage={changePage} changeOrderBy={changeOrderBy} />
          :
          <NotData />
      }

      <AuditModalSearch />
    </div>
  );
}