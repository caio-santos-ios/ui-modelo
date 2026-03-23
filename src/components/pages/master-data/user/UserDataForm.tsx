"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { maskCNPJ, maskPhone } from "@/utils/mask.util";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ResetUser, TUser } from "@/types/master-data/user/user.type";

type TProp = {
  id?: string;
};

export default function UserDataForm({id}: TProp) {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();

  const { register, handleSubmit, reset, setValue, watch, getValues, formState: { errors }} = useForm<TUser>({
    defaultValues: ResetUser
  });

  const save = async (body: TUser) => {
    if(!body.id) {
      await create(body);
    } else {
      await update(body);
    };
  } 
    
  const create: SubmitHandler<TUser> = async (body: TUser) => {
    try {
      setIsLoading(true);
      const {data} = await api.post(`/users`, body, configApi());
      resolveResponse({status: 201, message: data.result.message});
      router.push(`/master-data/users/${data.result.data.id}`)
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const update: SubmitHandler<TUser> = async (body: TUser) => {
    try {
      setIsLoading(true);
      const {data} = await api.put(`/users`, body, configApi());
      resolveResponse({status: 200, message: data.result.message});
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      setIsLoading(true);
      const {data} = await api.get(`/users/${id}`, configApi());
      const result = data.result.data;
      reset(result);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(id != "create") {
      getById(id!);
    };
  }, []);

  return (
    <>

      <ComponentCard title="Dados Gerais">
        <div className="grid grid-cols-6 gap-2 container-form">
          <div className="col-span-6 xl:col-span-2">
            <Label title="Nome"/>
            <input placeholder="Nome" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
          </div>

          <div className="col-span-6 xl:col-span-2">
            <Label title="E-mail"/>
            <input placeholder="E-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
          </div>
        </div>
      </ComponentCard>
      <Button onClick={() => save({...getValues()})} type="submit" className="w-full xl:w-20 mt-2" size="sm">Salvar</Button>
    </>
  );
}