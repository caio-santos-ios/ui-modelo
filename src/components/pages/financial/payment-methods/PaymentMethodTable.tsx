"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { NotData } from "@/components/not-data/NotData";
import { useModal } from "@/hooks/useModal";
import PaymentMethodModalCreate from "./PaymentMethodModalCreate";
import { paymentMethodAtom, paymentMethodModalAtom } from "@/jotai/financial/payment-method.jotai";
import { ResetPaymentMethod } from "@/types/financial/payment-method.type";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";

const columns: TDataTableColumns[] = [
  {title: "Código", label: "code", type: "text"},
  {title: "Nome", label: "name", type: "text"},
  {title: "Parcelas", label: "numberOfInstallments", type: "text"},
  {title: "Data de Criação", label: "createdAt", type: "date"},
]

const module = "D";
const routine = "D1";

export default function PaymentMethodTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom); 
  const [paymentMethod, setPaymentMethod] = useAtom(paymentMethodAtom);  
  const { isOpen, openModal, closeModal } = useModal();
  const [modalCreate, setModalCreate] = useAtom(paymentMethodModalAtom);

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const {data} = await api.get(`/payment-methods?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
      const result = data?.result?.data;
      
      setPagination({
        currentPage: result.currentPage,
        data: result.data ?? [],
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

  const changePage = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));

    await getAll(page);
  };

  const destroy = async () => {
    try {
      setLoading(true);
      await api.delete(`/payment-methods/${paymentMethod.id}`, configApi());
      resolveResponse({status: 204, message: "Excluído com sucesso"});
      closeModal();
      setPaymentMethod(ResetPaymentMethod);
      await getAll(pagination.currentPage);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setPaymentMethod(obj);

    if(action == "edit") {
      setModalCreate(true);
    };

    if(action == "delete") {
      openModal();
    };
  };
  
  useEffect(() => {
    if(permissionRead(module, routine)) {
      getAll(1);
    };
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
      <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Forma de Pagamento" />          
      <PaymentMethodModalCreate />
    </div>
  );
}