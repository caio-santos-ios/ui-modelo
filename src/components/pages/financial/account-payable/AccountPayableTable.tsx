"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { NotData } from "@/components/not-data/NotData";
import { useModal } from "@/hooks/useModal";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { IconView } from "@/components/icons/global/iconView/IconView";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { IconPayment } from "@/components/icons/financial/IconPayment";
import { ResetPagination } from "@/types/global/pagination.type";
import { IconCancel } from "@/components/icons/financial/IconCancel";
import { accountPayableAtom, accountPayableCancelModalAtom, accountPayableModalAtom, accountPayablePaymentModalAtom } from "@/jotai/financial/accounts-payable.jotai";
import { ResetAccountPayable } from "@/types/financial/account-payable.type";
import AccountPayableModalPayment from "./AccountPayableModalPayment";
import AccountPayableModalCreate from "./AccountPayableModalCreate";
import { SupplierModalCreate } from "../../master-data/supplier/SupplierModalCreate";

const columns: TDataTableColumns[] = [
    {title: "Fornecedor",       label: "supplierName",      type: "text"},
    {title: "Descrição",        label: "description",       type: "text"},
    {title: "Forma pg.",        label: "paymentMethodName", type: "text"},
    {title: "Valor",            label: "amount",            type: "money"},
    {title: "Valor Recebido",   label: "amountPaid",        type: "money"},
    {title: "Emissão",          label: "issueDate",         type: "date"},
    {title: "Vencimento",       label: "dueDate",           type: "date"},
    {title: "Status",           label: "status",            type: "workflow"},
    {title: "Data de Criação",  label: "createdAt",         type: "date"},
];

const module = "D";
const routine = "D3";

export default function AccountPayableTable() {
    const [_, setLoading] = useAtom(loadingAtom);
    const [pagination, setPagination] = useAtom(paginationAtom);
    const [accountPayable, setAccountPayable] = useAtom(accountPayableAtom);
    const { isOpen, openModal, closeModal } = useModal();
    const [modalCreate, setModalCreate] = useAtom(accountPayableModalAtom);
    const [modalPayment, setModalPayment] = useAtom(accountPayablePaymentModalAtom);
    const [modalCancel, setModalCancel] = useAtom(accountPayableCancelModalAtom);

    const getAll = async (page: number) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/accounts-payable?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
            const result = data?.result?.data ?? ResetPagination;
            
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
        setPagination(prev => ({ ...prev, currentPage: page }));
        await getAll(page);
    };

    const destroy = async () => {
        try {
            setLoading(true);
            await api.delete(`/accounts-payable/${accountPayable.id}`, configApi());
            resolveResponse({ status: 204, message: "Excluído com sucesso" });
            closeModal();
            setAccountPayable(ResetAccountPayable);
            await getAll(1);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };  
    
    const cancel = async () => {
        try {
            setLoading(true);
            await api.put(`/accounts-payable/cancel`, {...accountPayable}, configApi());
            resolveResponse({ status: 204, message: "Cancelado com sucesso" });
            setAccountPayable(ResetAccountPayable);
            setModalCancel(false);
            await getAll(1);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getObj = (obj: any, action: string) => {
        setAccountPayable(obj);

        if (action === "edit") setModalCreate(true);
        if (action === "view") setModalCreate(true);
        if (action === "delete") openModal();
        if (action === "pay") setModalPayment(true);
        if (action === "cancel") setModalCancel(true);
    };

    useEffect(() => {
        if (permissionRead(module, routine)) {
            getAll(1);
        }
    }, [modalCreate, modalPayment, modalCancel]);

    return (
        <div>
            {
                pagination.data.length > 0 ? 
                <DataTableCard isActions={permissionUpdate(module, routine) || permissionDelete(module, routine) || permissionRead(module, routine)} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
                <>
                    {
                        permissionUpdate(module, routine) && obj.status !== "Pago" && obj.status !== "Cancelado" &&
                        <IconPayment action="pay" obj={obj} getObj={getObj}/>
                    }
                    {
                        permissionUpdate(module, routine) && obj.status == "Em Aberto" &&
                        <IconEdit action="edit" obj={obj} getObj={getObj}/>
                    }
                    {
                        permissionDelete(module, routine) && (obj.status == "Pago" || obj.status == "Pago Parcial") &&
                        <IconCancel action="cancel" obj={obj} getObj={getObj}/>
                    }
                    {
                        permissionDelete(module, routine) && obj.status == "Em Aberto" &&
                        <IconDelete action="delete" obj={obj} getObj={getObj}/>
                    }
                    {
                        permissionRead(module, routine) && obj.status != "Em Aberto" &&
                        <IconView action="view" obj={obj} getObj={getObj} />
                    }
                </>
                )}/>
                :
                <NotData />
            }
            <SupplierModalCreate />
            <AccountPayableModalCreate />
            <AccountPayableModalPayment /> 
            <ModalDelete confirm={cancel} isOpen={modalCancel} closeModal={() => setModalCancel(false)} title="Cancelar Conta a Pagar" description="Deseja Cancelar esse Título?" />          
            <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Conta a Pagar" />          
        </div>
    );
}