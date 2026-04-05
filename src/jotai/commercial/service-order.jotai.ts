import { ResetServiceOrder, TServiceOrder } from "@/types/commercial/sales-order.type";
import { atom } from "jotai";

export const serviceOrderModalAtom = atom<boolean>(false);
export const serviceOrderAtom = atom<TServiceOrder>(ResetServiceOrder);