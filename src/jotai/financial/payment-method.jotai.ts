import { ResetPaymentMethod, TPaymentMethod } from "@/types/financial/payment-method.type";
import { atom } from "jotai";

export const paymentMethodModalAtom = atom<boolean>(false);
export const paymentMethodAtom = atom<TPaymentMethod>(ResetPaymentMethod);