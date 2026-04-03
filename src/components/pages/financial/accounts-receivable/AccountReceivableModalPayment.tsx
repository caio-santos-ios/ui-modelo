"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useAtom } from "jotai";
import Button from "@/components/ui/button/Button";
import { Controller, useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import { NumericFormat } from "react-number-format";
import { accountReceivableAtom, accountReceivablePaymentModalAtom } from "@/jotai/financial/accounts-receivable.jotai";
import { ResetAccountReceivable, ResetPaymentAccountReceivable, TPaymentAccountReceivable } from "@/types/financial/accounts-receivable.type";
import ModalV2 from "@/components/ui/modalV2";

export default function AccountReceivableModalPayment() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [modal, setModal] = useAtom(accountReceivablePaymentModalAtom);
  const [accountReceivable, setAccountReceivable] = useAtom(accountReceivableAtom);

  const { getValues, register, reset, control } = useForm<TPaymentAccountReceivable>({
    defaultValues: ResetPaymentAccountReceivable
  });

  const pay = async () => {
    try {
      setLoading(true);
      const payload = { ...getValues(), id: accountReceivable.id };
      const { data } = await api.put(`/accounts-receivable/pay`, payload, configApi());
      const result = data.result;
      resolveResponse({ status: 200, message: result.message });
      closeModal();
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal(false);
    setAccountReceivable(ResetAccountReceivable);
    reset();
  };

  return (
    <ModalV2 isOpen={modal} onClose={closeModal} title="Baixar Título" description="Registre o recebimento deste título">
      <form className="flex flex-col py-4 px-4 gap-4">
        <div className={`grid grid-cols-6 gap-4 max-h-[calc(100dvh-10rem)] overflow-y-auto`}>
          <div className="col-span-6 lg:col-span-3">
            <Label title="Valor Recebido (R$)" />
            <Controller
              name="amountPaid"
              control={control}
              defaultValue={0}
              render={({ field: { onChange, value } }) => (
                <NumericFormat
                  className="input-erp-primary input-erp-default" 
                  value={value}
                  onValueChange={(v) => onChange(v.floatValue)}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="Custo Atual"
                />
              )}
            />
          </div>

          <div className="col-span-6 lg:col-span-3">
            <Label title="Data do Recebimento" />
            <input {...register("paidAt")} type="date" className="input-erp-primary input-erp-default" />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
          <Button size="sm" variant="primary" onClick={pay}>Confirmar Baixa</Button>
        </div>
      </form>
    </ModalV2>
  );
}
