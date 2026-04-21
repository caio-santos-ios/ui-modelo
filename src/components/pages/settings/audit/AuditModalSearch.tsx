"use client";

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { userAtom } from "@/jotai/master-data/user.jotai";
import { auditModalSearchAtom } from "@/jotai/settings/audit.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveParamsRequest, resolveResponse } from "@/service/config.service";
import { ResetUser, TUser } from "@/types/master-data/user.type";
import { ResetAuditSearch, TAuditSearch } from "@/types/setting/audit.type";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const AuditModalSearch = () => {
    const [pagination, setPagination] = useAtom(paginationAtom); 
    const [modal, setModal] = useAtom(auditModalSearchAtom);
    const [_, setLoading] = useAtom(loadingAtom);
    const [users, setUsers] = useState<TUser[]>([]);

    const { register, handleSubmit, reset, setValue, watch, getValues, formState: { errors }} = useForm<TAuditSearch>({
        defaultValues: ResetAuditSearch
    });

    const closeModal = () => {
        setModal(false);
        reset(ResetAuditSearch);
        setPagination(pag => ({...pag, query: `deleted=false`}));
    };

    const confirm = async (body: TAuditSearch) => {
        setPagination(pag => ({...pag, query: `deleted=false${resolveParamsRequest(body)}`}));
        console.log(pagination)
        setModal(false);
    }

    const loaderUser = async () => {
        try {
            setLoading(true);
            const {data} = await api.get(`/users/select?deleted=false&active=true&blocked=false`, configApi());
            const result = data?.result?.data ?? [];
            setUsers(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(modal) {
            loaderUser();
        }
    }, [modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Filtro Auditoria">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <div className="col-span-6">
                        <Label title="Metodo" required={false}/>
                        <select {...register("method")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800 dark:bg-dark-900">
                            <option value="" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Todos</option>
                            <option value="GET" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">GET</option>
                            <option value="POST" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">POST</option>
                            <option value="PUT" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">PUT</option>
                            <option value="DELETE" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">DELETE</option>
                        </select>
                    </div>   
                    <div className="col-span-6">
                        <Label title="Status" required={false}/>
                        <select {...register("statusCode")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800 dark:bg-dark-900">
                            <option value="" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Todos</option>
                            <option value="200" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">200</option>
                            <option value="201" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">201</option>
                            <option value="204" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">204</option>
                            <option value="400" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">400</option>
                            <option value="401" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">401</option>
                            <option value="403" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">403</option>
                            <option value="404" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">404</option>
                            <option value="500" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">500</option>
                            <option value="502" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">502</option>
                        </select>
                    </div>   
                    <div className="col-span-6">
                        <Label title="Usuário" required={false}/>
                        <select {...register("createdBy")} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-800 dark:bg-dark-900">
                            <option value="" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">Todos</option>
                            {
                                users.map(x => <option key={x.id} value={x.id} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">{x.name}</option>)
                            }
                        </select>
                    </div>   
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Limpar</Button>
                    <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Filtrar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}