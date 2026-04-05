"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { formattedMoney, maskDate } from "@/utils/mask.util";
import { permissionRead } from "@/utils/permission.util";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { ServiceOrderModalCreate } from "./modals/ServiceOrderModalCreate";
import { Avatar } from "@/components/kanban/Kanban";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { ResetServiceOrder, TServiceOrder } from "@/types/commercial/sales-order.type";

const COLUMNS = [
  { key: "Em Aberto",  label: "Em aberto",  color: "text-blue-600 dark:text-blue-400",  bg: "bg-blue-50 dark:bg-blue-950/40",  dot: "bg-blue-500" },
  { key: "Fazendo",    label: "Fazendo",    color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", dot: "bg-amber-500" },
  { key: "Finalizado", label: "Finalizado", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/40", dot: "bg-green-500" },
];

const PRIORITY_STYLE: Record<string, string> = {
  Baixa:   "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  Normal:  "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  Alta:    "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  Urgente: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

const module = "E";
const routine = "E1";

export default function ServiceOrderTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);
  const { isOpen, openModal, closeModal } = useModal();
  const [selected, setSelected] = useState<TServiceOrder>(ResetServiceOrder);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ✅ Estado local para renderizar e reagir ao drag & drop
  const [items, setItems] = useState<any[]>([]);
  // ✅ Por coluna: qual está com drag sobre ela
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);
  const router = useRouter();

  const getAll = async (page: number) => {
    try {
      let strSearch = "deleted=false";
      if (search) strSearch += `&regex$or$code=${search}&regex$or$customerName=${search}&regex$or$device.serialImei`;
      if (statusFilter) strSearch += `&status=${statusFilter}`;

      const { data } = await api.get(
        `/service-orders?${strSearch}&orderBy=createdAt&sort=desc&pageSize=999&pageNumber=${page}`,
        configApi()
      );
      const result = data.result;

      setPagination({
        currentPage: result.currentPage,
        data: result.data,
        sizePage: result.pageSize,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      });

      // ✅ Sincroniza o estado local com os dados da API
      setItems(result.data);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const destroy = async () => {
    try {
      setLoading(true);
      await api.delete(`/service-orders/${selected.id}`, configApi());
      resolveResponse({ status: 204, message: "Excluído com sucesso" });
      closeModal();
      await getAll(pagination.currentPage);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setSelected(obj);
    if (action === "edit" || action === "view") router.push(`/commercials/service-orders/${obj.id}`);
    if (action === "delete") openModal();
  };

  // ─── Drag & Drop ────────────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, id: string) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colKey);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // ✅ Só limpa se saiu do elemento da coluna de verdade (não de um filho)
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOverCol(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    setDragOverCol(null);

    const id = dragId.current;
    dragId.current = null;

    if (!id) return;

    const item = items.find((o) => o.id === id);
    if (!item || item.status === colKey) return;

    // ✅ Atualiza localmente (otimista) — UI reage na hora
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, status: colKey } : o)));

    try {
      await api.put(`/service-orders/status`, { status: colKey, id }, configApi());
    } catch (error) {
      setItems((prev) => prev.map((o) => (o.id === id ? { ...o, status: item.status } : o)));
      resolveResponse(error);
    }
  };

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (permissionRead(module, routine)) getAll(1);
  }, [search, statusFilter]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colItems = items.filter((o) => o.status === col.key);
          const total = colItems.reduce((s, o) => s + (o.value ?? 0), 0);
          const isOver = dragOverCol === col.key;

          return (
            <div
              key={col.key}
              className={`flex flex-col rounded-2xl transition-colors duration-150 ${col.bg} ${isOver ? "ring-2 ring-brand-400 ring-offset-1" : ""}`}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                  <span className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${col.color} bg-black/5 dark:bg-white/10`}>
                    {colItems.length}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {formattedMoney(total)}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 p-3 flex-1 max-h-[calc(100dvh-16rem)] overflow-y-auto">
                {colItems.length === 0 && (
                  <div className={`flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed transition-colors ${isOver ? "border-brand-400 bg-brand-50/50 dark:bg-brand-900/20" : "border-black/10 dark:border-white/10"}`}>
                    <span className="text-xs text-gray-400 dark:text-gray-600">Solte aqui</span>
                  </div>
                )}
                {colItems.map((os) => (
                  <div
                    key={os.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, os.id)}
                    // onClick={() => modalDetails(os.id)}
                    className="cursor-grab active:cursor-grabbing rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600 select-none"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 font-mono tracking-wide">
                        #{os.code}
                      </span>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLE[os.priority] ?? ""}`}>
                        {os.priority}
                      </span>
                      <div className="flex gap-2">
                        <IconDelete getObj={getObj} action="delete" obj={os} />
                        <IconEdit getObj={getObj} action="edit" obj={os} />
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug mb-1 line-clamp-1">
                      {os.customerName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3">
                      {os.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5">
                        {os.userName && <Avatar name={os.userName} />}
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[90px]">
                          {os.userName ?? "Não atribuído"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {formattedMoney(os.value)}
                        </span>
                        {os.forecasDate && (
                          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            {maskDate(os.forecasDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* <ServiceOrderModalSearch /> */}
      <ServiceOrderModalCreate />
      <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Ordem de Serviço" />          
    </div>
  );
}