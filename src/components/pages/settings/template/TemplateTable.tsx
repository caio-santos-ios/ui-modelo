"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { useRouter } from "next/navigation";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { useModal } from "@/hooks/useModal";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { MdPageview, MdSend } from "react-icons/md";
import { templateAtom, templateModalPreviewAtom } from "@/jotai/settings/template.jotai";
import { TemplateModalPreview } from "./TemplateModalPreview";
import { TPagination } from "@/types/global/pagination.type";

const columns: TDataTableColumns[] = [
  { title: "Código", label: "code", type: "text" },
  { title: "Data de Criação", label: "createdAt", type: "date" },
]

const module = "A";
const routine = "A2";

export default function TemplateTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);
  const { isOpen, openModal, closeModal } = useModal();
  const [template, setTemplate] = useAtom(templateAtom);
  const [__, setPreviewTemplateModal] = useAtom(templateModalPreviewAtom);
  const router = useRouter();

  const getAll = async (pag: TPagination) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/templates?${pag.query}&orderBy=${pag.orderBy}&sort=${pag.sort}&pageSize=10&pageNumber=${pag.currentPage}`, configApi());
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

  const destroy = async () => {
    try {
      setLoading(true);
      await api.delete(`/templates/${template.id}`, configApi());
      resolveResponse({ status: 204, message: "Excluído com sucesso" });
      closeModal();
      await getAll(pagination);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const send = async (obj: any) => {
    try {
      setLoading(true);
      await api.put(`/templates/send-mail`, { ...obj }, configApi());
      resolveResponse({ status: 200, message: "Enviado com sucesso" });
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setTemplate(obj);

    if (action == "view") {
      setPreviewTemplateModal(true);
    };

    if (action == "edit") {
      router.push(`/settings/templates/${obj.id}`);
    };

    if (action == "delete") {
      openModal();
    };
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
  }, []);

  return (
    <div>
      {
        pagination.data.length > 0 ?
          <DataTableCard isActions={permissionUpdate(module, routine) || permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} changeOrderBy={changeOrderBy} actions={(obj) => (
            <>
              {
                permissionRead(module, routine) &&
                <div title="Visualizar" onClick={() => getObj(obj, "view")} className="cursor-pointer text-orange-400 hover:text-orange-500">
                  <MdPageview />
                </div>
              }
              {
                permissionUpdate(module, routine) &&
                <div title="Enviar E-mail" onClick={() => send(obj)} className="cursor-pointer text-blue-400 hover:text-blue-500">
                  <MdSend />
                </div>
              }
              {
                permissionUpdate(module, routine) &&
                <IconEdit action="edit" obj={obj} getObj={getObj} />
              }
              {
                permissionDelete(module, routine) &&
                <IconDelete action="delete" obj={obj} getObj={getObj} />
              }
            </>
          )
          } />
          :
          <NotData />
      }
      <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Perfil de Usuário" />
      <TemplateModalPreview />
    </div>
  );
}