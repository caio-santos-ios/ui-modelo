"use client";

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { profileModalAtom } from "@/jotai/master-data/profile.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetUser, TUser, TUserLogged } from "@/types/master-data/user.type";
import { getUserLogged } from "@/utils/auth.util";
import { maskCPF } from "@/utils/mask.util";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const ProfileModalCreate = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [modal, setModal] = useAtom(profileModalAtom);

    const userLogged: TUserLogged = getUserLogged();

    const { register, handleSubmit, reset, setValue, watch, getValues, formState: { errors }} = useForm<TUser>({
        defaultValues: ResetUser
    });

    const closeModal = () => {
        setModal(false);
        reset(ResetUser);
    };

    const confirm = async (body: TUser) => {
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

    const getById = async () => {
        try {
            setLoading(true);
            const {data} = await api.get(`/users/${userLogged.id}`, configApi());
            const result = data.result.data;
            reset(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(modal) {
            getById();
        };
    }, [modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Usuário">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <div className="col-span-6">
                        <Label title="Nome Completo"/>
                        <input placeholder="Nome Completo" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
                    </div>
                    <div className="col-span-6">
                        <Label title="E-mail"/>
                        <input placeholder="E-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Confirmar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}