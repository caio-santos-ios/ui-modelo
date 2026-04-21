import { ResetAuditSearch, TAuditSearch } from "@/types/setting/audit.type";
import { atom } from "jotai";

export const auditAtom = atom<TAuditSearch>(ResetAuditSearch);
export const auditModalSearchAtom = atom<boolean>(false);