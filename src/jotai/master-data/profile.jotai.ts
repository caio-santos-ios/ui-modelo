import { ResetUser, TUser } from "@/types/master-data/user.type";
import { atom } from "jotai";

export const profileModalAtom = atom<boolean>(false);
export const profileModalUpdatePasswordAtom = atom<boolean>(false);
export const profileAtom = atom<TUser>(ResetUser);