"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { permissionDelete } from "@/utils/permission.util";
import Button from "@/components/ui/button/Button";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { ResetAttachment } from "@/types/setting/attachment.type";
import { attachmentAtom, attachmentModalAtom } from "@/jotai/settings/attachment.jotai";
import { ServiceOrderAttachmentModalCreate } from "../modals/ServiceOrderAttachmentModalCreate";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { NotData } from "@/components/not-data/NotData";
import { modalDeleteAtom } from "@/jotai/global/modal.jotai";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";

type TProp = {
  serviceOrderId: string;
};

const columns: TDataTableColumns[] = [
  {title: "Descrição",  label: "description", type: "text"},
  {title: "Data de Criação", label: "createdAt", type: "date"},
]

const module = "E";
const routine = "E1";

export default function ServiceOrderAttachmentsTab({ serviceOrderId }: TProp) {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom); 
  const [attachment, setAttachment] = useAtom(attachmentAtom);
  const [modal, setModal] = useAtom(attachmentModalAtom);
  const [modalDelete, setModalDelete] = useAtom(modalDeleteAtom);

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/attachments?deleted=false&parent=service-orders&parentId=${serviceOrderId}&pageSize=50&pageNumber=${page}`, configApi());
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
      await api.delete(`/attachments/${attachment.id}`, configApi());
      resolveResponse({ status: 204, message: "Anexo removido" });
      getAll(1);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };
  
  const getObj = (obj: any, action: string) => {
    setAttachment(obj);

    if(action == "delete") setModalDelete(true);
  };

  const changePage = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));

    await getAll(page);
  };

  useEffect(() => {
    getAll(1);
  }, [modal]);

  return (
    <ComponentCard title="Peças e Serviços" hasHeader={false}>
      <Button size="sm" variant="primary" onClick={() => {
        setAttachment({
          ...ResetAttachment,
          parent: "service-orders",
          parentId: serviceOrderId,
        });
        setModal(true);
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.333v9.334M3.333 8h9.334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Adicionar Anexo
      </Button>

      {
        pagination.data.length > 0 ? 
        <DataTableCard isActions={permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
          <>
            {
              permissionDelete(module, routine) &&
              <IconDelete action="delete" obj={obj} getObj={getObj}/> 
            }
          </>
        )}/>
        :
        <NotData />
      }

      <ServiceOrderAttachmentModalCreate />
      <ModalDelete confirm={destroy} isOpen={modalDelete} closeModal={() => setModalDelete(false)} title="Excluir Anexo" />
    </ComponentCard>
  );
}
