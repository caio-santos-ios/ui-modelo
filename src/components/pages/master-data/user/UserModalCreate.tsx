"use client";

import { FieldInput } from "@/components/form/FieldInput";
import { FieldSelect } from "@/components/form/FieldSelect";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { userAtom, userModalAtom } from "@/jotai/master-data/user.jotai";
import { userCreateSchema } from "@/schemas/master-data/user.schema";
import { api } from "@/service/api.service";
import { configApi, onError, resolveResponse } from "@/service/config.service";
import { ResetUser, TUser } from "@/types/master-data/user.type";
import { TProfileUser } from "@/types/setting/profile-permission.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const UserModalCreate = () => {
    const [modal, setModal] = useAtom(userModalAtom);
    const [user, setUser] = useAtom(userAtom);
    const [_, setLoading] = useAtom(loadingAtom);
    const [profileUsers, setProfileUsers] = useState<TProfileUser[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    const { register, reset, handleSubmit, formState: { errors }} = useForm<TUser>({
        defaultValues: ResetUser,
        resolver: zodResolver(userCreateSchema)
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
    
    const loaderProfileUser = async () => {
        try {
            setLoading(true);
            const {data} = await api.get(`/profile-users/select?deleted=false`, configApi());
            const result = data?.result?.data ?? [];
            setProfileUsers(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loaderProfileUser();

        if(user.id && modal) {
            getById(user.id);
        };
    }, [user.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Usuário">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <FieldInput registration={{...register("name")}} placeholder="Nome" label="Nome" cols="col-span-6"/>
                    <FieldInput registration={{...register("email")}} placeholder="E-mail" label="E-mail" cols="col-span-6" type="email"/>
                    {
                        !user.id && (
                            <div className="col-span-6">
                                <Label title="Senha"/>
                                <div className="relative">
                                    <input placeholder="Sua senha" {...register("password")} type={showPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                        {showPassword ? (
                                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                        ) : (
                                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                        )}
                                    </span>
                                </div>
                            </div>
                        )
                    }

                    <FieldSelect cols="col-span-6" label="Perfil do Usuário" registration={register("profileUserId")} options={profileUsers} optionValue="id" optionLabel="name" />   
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    <Button size="sm" variant="primary" onClick={handleSubmit(confirm, onError)}>Confirmar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}