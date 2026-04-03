import { ResetAccountPayable, TAccountPayable } from "@/types/financial/account-payable.type";
import { atom } from "jotai";

export const accountPayableModalAtom = atom<boolean>(false);
export const accountPayablePaymentModalAtom = atom<boolean>(false);
export const accountPayableCancelModalAtom = atom<boolean>(false);
export const accountPayableAtom = atom<TAccountPayable>(ResetAccountPayable);
