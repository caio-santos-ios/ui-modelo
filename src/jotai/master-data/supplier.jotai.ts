import { ResetSupplier, TSupplier } from "@/types/master-data/supplier.type";
import { atom } from "jotai";

export const supplierModalAtom = atom<boolean>(false);
export const supplierModalUpdatePasswordAtom = atom<boolean>(false);
export const supplierAtom = atom<TSupplier>(ResetSupplier);