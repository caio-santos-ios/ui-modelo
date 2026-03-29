"use client";

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { userAtom, userModalAtom } from "@/jotai/master-data/user.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetUser, TUser } from "@/types/master-data/user/user.type";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const UserModalCreate = () => {
    const [modal, setModal] = useAtom(userModalAtom);
    const [user, setUser] = useAtom(userAtom);
    const [_, setLoading] = useAtom(loadingAtom);

    const { register, handleSubmit, reset, setValue, watch, getValues, formState: { errors }} = useForm<TUser>({
        defaultValues: ResetUser
    });

    const closeModal = () => {
        setModal(false);
        setUser(ResetUser);
        reset();
    };

    const confirm = async (body: TUser) => {
        if(!body.id) {
            await create(body);
        } else {
            await update(body);
        };
    } 
        
    const create: SubmitHandler<TUser> = async (body: TUser) => {
        try {
            setLoading(true);
            const {data} = await api.post(`/users`, body, configApi());
            resolveResponse({status: 201, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
        
    const update: SubmitHandler<TUser> = async (body: TUser) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/users`, body, configApi());
            resolveResponse({status: 200, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getById = async (id: string) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/users/${id}`, configApi());
            const result = data.result.data;
            reset(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(user.id && modal) {
            getById(user.id);
        };
    }, [user.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Usuário">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <div className="col-span-6 xl:col-span-2">
                        <Label title="Nome"/>
                        <input placeholder="Nome" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
                    </div>

                    <div className="col-span-6 xl:col-span-2">
                        <Label title="E-mail"/>
                        <input placeholder="E-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Confirmar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}