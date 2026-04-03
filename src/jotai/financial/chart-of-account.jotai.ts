import { ResetChartOfAccounts, TChartOfAccounts } from "@/types/financial/chartofaccounts.type";
import { atom } from "jotai";

export const chartOfAccountModalAtom = atom<boolean>(false);
export const chartOfAccountAtom = atom<TChartOfAccounts>(ResetChartOfAccounts);