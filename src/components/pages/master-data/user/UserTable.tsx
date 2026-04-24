"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { useModal } from "@/hooks/useModal";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { UserModalCreate } from "./UserModalCreate";
import { userAtom, userModalAtom, userModalUpdatePasswordAtom } from "@/jotai/master-data/user.jotai";
import { FaLock } from "react-icons/fa";
import { getUserLogged } from "@/utils/auth.util";
import { TUserLogged } from "@/types/master-data/user.type";
import { UserModalUpdatePassword } from "./UserModalUpdatePassword";
import { ResetPagination, TPagination } from "@/types/global/pagination.type";

const columns: TDataTableColumns[] = [
  { title: "Nome", label: "name", type: "text" },
  { title: "E-mail", label: "email", type: "text" },
  { title: "Data de Criação", label: "createdAt", type: "date" },
]

const module = "B";
const routine = "B1";

export default function UserTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useAtom(userAtom);
  const [modal, setModal] = useAtom(userModalAtom);
  const [modalUpdatePassword, setModalUpdatePassword] = useAtom(userModalUpdatePasswordAtom);

  const userLogged: TUserLogged = getUserLogged();

  const getAll = async (pag: TPagination) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users?${pag.query}&orderBy=${pag.orderBy}&sort=${pag.sort}&pageSize=10&pageNumber=${pag.currentPage}`, configApi());
      const result = data.result.data ?? ResetPagination;

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
      await api.delete(`/users/${user.id}`, configApi());
      resolveResponse({ status: 204, message: "Excluído com sucesso" });
      closeModal();
      await getAll(pagination);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setUser(obj);

    if (action == "edit") setModal(true);

    if (action == "update-password") { setModalUpdatePassword(true); }

    if (action == "delete") openModal();
  };

  const changePage = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));

    await getAll({...pagination, currentPage: page});
  };

  const changeOrderBy = async (orderBy: string) => {
    const orderBySort = orderBy.split(" ");

    setPagination(pag => ({
      ...pag,
      orderBy: orderBySort[0],
      sort: orderBySort[1]
    }));

    await getAll({...pagination, orderBy: orderBySort[0], sort: orderBySort[1]});
  };

  useEffect(() => {
    if (permissionRead(module, routine)) {
      getAll(pagination);
    };
  }, [modal, modalUpdatePassword]);

  return (
    <div>
      {
        pagination.data.length > 0 ?
          <DataTableCard isActions={permissionUpdate(module, routine) || permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} changeOrderBy={changeOrderBy} actions={(obj) => (
            <>
              {
                permissionUpdate(module, routine) && (obj.id == userLogged.id || userLogged.admin || userLogged.master) &&
                <div title="Alterar Senha" onClick={() => getObj(obj, "update-password")} className="cursor-pointer text-blue-400 hover:text-blue-500">
                  <FaLock />
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
      <UserModalUpdatePassword />
      <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Usuário" />
      <UserModalCreate />
    </div>
  );
}