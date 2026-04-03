import { ResetAccountReceivable, TAccountReceivable } from "@/types/financial/accounts-receivable.type";
import { atom } from "jotai";

export const accountReceivableModalAtom = atom<boolean>(false);
export const accountReceivablePaymentModalAtom = atom<boolean>(false);
export const accountReceivableCancelModalAtom = atom<boolean>(false);
export const accountReceivableAtom = atom<TAccountReceivable>(ResetAccountReceivable);
