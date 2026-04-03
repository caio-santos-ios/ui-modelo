import { ResetFilterDashboard, TFilterDashboard } from "@/types/dashboard/filter-dashboard.type";
import { atom } from "jotai";

export const filterDashboardAtom = atom<TFilterDashboard>(ResetFilterDashboard);
export const searchFilterDashboardAtom = atom<boolean>(false);