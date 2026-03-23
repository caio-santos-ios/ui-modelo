import { NavItem } from "@/types/global/menu.type";
import { atom } from "jotai";

export const menuOpenAtom = atom<boolean>(false);
export const menuRoutinesAtom = atom<NavItem[]>([
  {
    icon: "FiGrid",
    name: "Cadastros",
    authorized: false,
    code: "A",
    subItems: [
      {name: "Usuários", path: "/master-data/users", code: "A1", pro: false, authorized: false },
    ]
  }
]);