"use client";

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { attachmentAtom, attachmentModalAtom } from "@/jotai/settings/attachment.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetAttachment, TAttachment } from "@/types/setting/attachment.type";
import { convertObjFormData } from "@/utils/convert.util";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";

export const ServiceOrderAttachmentModalCreate = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [modal, setModal] = useAtom(attachmentModalAtom);
    const [attachment] = useAtom(attachmentAtom);

    const { register, reset, getValues } = useForm<TAttachment>({
        defaultValues: ResetAttachment
    });

    const closeModal = () => {
        setModal(false);
        reset(ResetAttachment);
    };

    const confirm = async (body: TAttachment) => {
        try {
            setLoading(true);
            const file: any = document.querySelector("#attachment");
            
            const form = convertObjFormData(body);
            form.append("parent", "service-orders");
            form.append("parentId", attachment.parentId);
            if(file.files && file.files.length > 0) {
                form.append("file", file.files[0]);
            };

            const {data} = await api.post(`/attachments`, form, configApi(false));
            resolveResponse({status: 201, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Anexo">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <div className="col-span-6 xl:col-span-2">
                        <Label title="Arquivo" />
                        <input type="file" placeholder="Arquivo" id="attachment" className="input-erp-primary input-erp-default"/>
                    </div>
                    <div className="col-span-6">
                        <Label title="Descrição" required={false}/>
                        <input placeholder="Nome" {...register("description")} type="text" className="input-erp-primary input-erp-default"/>
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