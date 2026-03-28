"use client";

import Pagination from "@/components/tables/Pagination";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { maskDate } from "@/utils/mask.util";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useModal } from "@/hooks/useModal";
import { IconEdit } from "@/components/icons/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/iconDelete/IconDelete";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { ResetUser, TUser } from "@/types/master-data/user/user.type";
import { NotData } from "@/components/not-data/NotData";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { TDataTableColumns } from "@/types/global/data-table-card.type";

const columns: TDataTableColumns[] = [
  {title: "Código", label: "code", type: "text"},
  {title: "Nome", label: "name", type: "text"},
  {title: "E-mail", label: "email", type: "text"},
  {title: "Data de Criação", label: "createdAt", type: "date"},
]

const module = "A";
const routine = "A1";

export default function UserTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom); 
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState<TUser>(ResetUser);
  const router = useRouter();

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const {data} = await api.get(`/users?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
      const result = data.result;

      setPagination({
        currentPage: result.currentPage,
        data: result.data,
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
      await api.delete(`/users/${user.id}`, configApi());
      resolveResponse({status: 204, message: "Excluído com sucesso"});
      closeModal();
      await getAll(pagination.currentPage);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setUser(obj);

    if(action == "edit") {
      router.push(`/master-data/users/${obj.id}`);
    };

    if(action == "delete") {
      openModal();
    };
  };

  const changePage = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));

    await getAll(page);
  };

  useEffect(() => {
    if(permissionRead(module, routine)) {
      getAll(1);
    };
  }, []);

  return (
    // pagination.data.length > 0 ?
    // <>
    //   <div className="erp-container-table rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 mb-3">
    //     <div className="max-w-full overflow-x-auto tele-container-table">
    //       <div className="min-w-[1102px] divide-y">
    //         <Table className="divide-y">
    //           <TableHeader className="border-b border-gray-100 dark:border-white/5">
    //             <TableRow>
    //               <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nome</TableCell>
    //               <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">E-mail</TableCell>
    //               <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Data de Criação</TableCell>
    //               <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Ações</TableCell>
    //             </TableRow>
    //           </TableHeader>

    //           <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
    //             {pagination.data.map((x: any) => (
    //               <TableRow key={x.id}>
    //                 <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">{x.name}</TableCell>
    //                 <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">{x.email}</TableCell>
    //                 <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">{maskDate(x.createdAt)}</TableCell>
    //                 <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">
    //                   <div className="flex gap-3">       
    //                     {
    //                       permissionUpdate("A", "A1") &&
    //                       <IconEdit action="edit" obj={x} getObj={getObj}/>
    //                     }   
    //                     {
    //                       permissionDelete("A", "A1") &&
    //                       <IconDelete action="delete" obj={x} getObj={getObj}/>                                                   
    //                     }                                          
    //                 </div>
    //                 </TableCell>
    //               </TableRow>
    //             ))}
    //           </TableBody>
    //         </Table>
    //       </div>
    //     </div>
    //   </div>
    //   <Pagination currentPage={pagination.currentPage} totalCount={pagination.totalCount} totalData={pagination.data.length} totalPages={pagination.totalPages} onPageChange={() => {}} />

    //   <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Usuário" />          
    // </>
    // :
    // <NotData />
    <div>
      {
        pagination.data.length > 0 ? 
        <DataTableCard pagination={pagination} columns={columns} changePage={changePage} actions={
          <>
            {
              permissionUpdate(module, routine) &&
              <IconEdit action="edit" obj={{}} getObj={getObj}/>
            }
            {
              permissionDelete(module, routine) &&
              <IconDelete action="delete" obj={{}} getObj={getObj}/> 
            }
          </>
        }/>
        :
        <NotData />
      }
      <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Perfil de Usuário" />
    </div>    
  );
}