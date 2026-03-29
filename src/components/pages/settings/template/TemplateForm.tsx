"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ResetTemplate, TTemplate } from "@/types/setting/template.type";
import TextArea from "@/components/form/input/TextArea";
import { permissionUpdate } from "@/utils/permission.util";

type TProp = {
  id?: string;
};

const module = "A";
const routine = "A2";

export default function TemplateForm({id}: TProp) {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();

  const { register, reset, setValue, watch, getValues } = useForm<TTemplate>({
    defaultValues: ResetTemplate
  });

  const save = async (body: TTemplate) => {
    if(!body.id) {
      await create(body);
    } else {
      await update(body);
    };
  } 
    
  const create: SubmitHandler<TTemplate> = async (body: TTemplate) => {
    try {
      setIsLoading(true);
      const {data} = await api.post(`/templates`, body, configApi());
      const result = data.result;
      resolveResponse({status: 201, message: result.message});
      router.push(`/settings/templates/${result.data.id}`)
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const update: SubmitHandler<TTemplate> = async (body: TTemplate) => {
    try {
      setIsLoading(true);
      const {data} = await api.put(`/templates`, body, configApi());
      const result = data.result;
      resolveResponse({status: 200, message: result.message});
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      setIsLoading(true);
      const {data} = await api.get(`/templates/${id}`, configApi());
      const result = data.result.data;
      reset(result);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initial = async () => {
      if(id != "create") {
        await getById(id!);
      };
    };
    initial();
  }, []);

  return (
    <>
      <ComponentCard title="Dados Gerais" hasHeader={false}>
        <div className="grid grid-cols-6 gap-2 max-h-[calc(100dvh-16rem)] md:max-h-[calc(100dvh-19rem)] overflow-y-auto">
          <div className="col-span-6">
            <Label title="Código"/>
            <input placeholder="Código" {...register("code")} type="text" className="input-erp-primary input-erp-default"/>
          </div>
          <div className="col-span-6">
            <Label title="HTML"/>
            <TextArea rows={7} value={watch("html")} onChange={(v) => {setValue("html", v)}} placeholder="HTML"/>
          </div>
        </div>
      </ComponentCard>
      {
        permissionUpdate(module, routine) && (
          <Button onClick={() => save({...getValues()})} type="submit" className="w-full xl:max-w-20 mt-2" size="sm">Salvar</Button>
        )
      }
    </>
  );
}