import { ResetCustomer, TCustomer } from "@/types/master-data/customer.type";
import { atom } from "jotai";

export const customerModalAtom = atom<boolean>(false);
export const customerModalUpdatePasswordAtom = atom<boolean>(false);
export const customerAtom = atom<TCustomer>(ResetCustomer);