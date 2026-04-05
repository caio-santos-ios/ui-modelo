"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { formattedMoney, maskMoney } from "@/utils/mask.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { permissionDelete, permissionUpdate } from "@/utils/permission.util";
import Button from "@/components/ui/button/Button";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { ResetServiceOrderItem, TServiceOrderItem } from "@/types/commercial/sales-order-item.type";

type TProp = {
  serviceOrderId: string;
};

export default function ServiceOrderItemsTab({ serviceOrderId }: TProp) {
  const [_, setLoading] = useAtom(loadingAtom);
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({});
  const [employees, setEmployees] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/service-order-items?deleted=false&serviceOrderId=${serviceOrderId}&pageSize=50&pageNumber=1`, configApi());
      const result = data.result;
      setItems(result.data || []);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getAutocompleSupplier = async (value: string) => {
    try {
        if(!value) return setSuppliers([]);
        // const {data} = await api.get(`/suppliers?deleted=false&orderBy=tradeName&sort=desc&pageSize=10&pageNumber=1&regex$or$tradeName=${value}&regex$or$corporateName=${value}`, configApi());
        // const result = data.result;
        // setSuppliers(result.data);
    } catch (error) {
        resolveResponse(error);
    }
  };

  const saveItem = async () => {
    try {
      setLoading(true);
      const payload = {
        ...form,
        serviceOrderId,
        total: form.quantity * form.price
      };

      if (form.id) {
        await api.put("/service-order-items", payload, configApi());
        resolveResponse({ status: 200, message: "Item atualizado com sucesso" });
      } else {
        await api.post("/service-order-items", payload, configApi());
        resolveResponse({ status: 201, message: "Item adicionado com sucesso" });
      }
      setForm({});
      setShowForm(false);
      fetchItems();
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (item: TServiceOrderItem) => {
    try {
      setLoading(true);
      await api.delete(`/service-order-items/${item.id}`, configApi());
      resolveResponse({ status: 204, message: "Item removido" });
      fetchItems();
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  return (
    <ComponentCard title="Peças e Serviços" hasHeader={false}>
      {items.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/3">
              <tr>
                {["Tipo", "Descrição", "Qtd", "Valor Unit.", "Total", "Ações"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/3">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.itemType === "service" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"}`}>
                      {item.itemType === "service" ? "Serviço" : "Peça"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.description}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formattedMoney(item.price)}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">{formattedMoney(item.quantity * item.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {permissionUpdate("A", "A4") && <IconEdit action="edit" obj={{}} getObj={() => {setForm(item); setShowForm(true);}} />}
                      {permissionDelete("A", "A4") && <IconDelete action="delete" obj={{}} getObj={() => {deleteItem(item)}} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-white/3">
          <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3 text-sm">
            {form.id ? "Editar Item" : "Adicionar Item"}
          </h4>
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-6 xl:col-span-2">
              <Label title="Tipo" />
              <select
                value={form.itemType}
                onChange={(e) => setForm((p: any) => ({ ...p, itemType: e.target.value }))}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-gray-800"
              >
                <option value="service">Serviço</option>
                <option value="part">Peça</option>
              </select>
            </div>
            <div className="col-span-6 xl:col-span-4">
              <Label title="Descrição" />
              <input
                type="text"
                placeholder="Descrição do serviço ou peça"
                value={form.description}
                onChange={(e) => setForm((p: any) => ({ ...p, description: e.target.value }))}
                className="input-erp-primary input-erp-default"
              />
            </div>
            <div className="col-span-6 xl:col-span-2">
              <Label title="Quantidade" />
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm((p: any) => ({ ...p, quantity: Number(e.target.value) }))}
                className="input-erp-primary input-erp-default"
              />
            </div>
            <div className="col-span-6 xl:col-span-2">
              <Label title="Valor Unitário (R$)" />
              <input
                type="text"
                placeholder="0,00"
                defaultValue={String(form.price)}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  maskMoney(e);
                  const val = parseFloat(e.target.value.replace(/\./g, "").replace(",", ".")) || 0;
                  setForm((p: any) => ({ ...p, price: val }));
                }}
                className="input-erp-primary input-erp-default"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={saveItem}
              className="h-9 px-5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
            >
              {form.id ? "Salvar" : "Adicionar"}
            </button>
            <button
              onClick={() => { setForm(ResetServiceOrderItem); setShowForm(false); }}
              className="h-9 px-4 rounded-lg border border-gray-300 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <Button size="sm" variant="primary" onClick={() => {
          setForm(ResetServiceOrderItem); setShowForm(true);
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.333v9.334M3.333 8h9.334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Adicionar Item</Button>
      )}
    </ComponentCard>
  );
}
