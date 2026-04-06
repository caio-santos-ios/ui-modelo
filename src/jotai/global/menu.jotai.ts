import { NavItem } from "@/types/global/menu.type";
import { atom } from "jotai";

export const menuOpenAtom = atom<boolean>(false);
export const menuRoutinesAtom = atom<NavItem[]>([
  {
    icon: "MdChat",
    name: "Chat",
    authorized: false,
    code: "C",
    path: "/chat",          
    subItems: undefined,
  },
  {
    icon: "FiSettings",
    name: "Configurações",
    authorized: false,
    code: "A",
    subItems: [
      {name: "Logs",          path: "/settings/logger",          code: "A1", pro: false, authorized: false },
      {name: "Templates",     path: "/settings/templates",       code: "A2", pro: false, authorized: false },
      {name: "Triggers",      path: "/settings/triggers",        code: "A3", pro: false, authorized: false },
      {name: "Auditoria",     path: "/settings/audits",          code: "A4", pro: false, authorized: false },
    ]
  },
  {
    icon: "FiGrid",
    name: "Cadastros",
    authorized: false,
    code: "B",
    subItems: [
      {name: "Usuários",          path: "/master-data/users",          code: "B1", pro: false, authorized: false },
      {name: "Perfil de Usuário", path: "/master-data/profile-users",  code: "B2", pro: false, authorized: false },
      {name: "Clientes",          path: "/master-data/customers",      code: "B3", pro: false, authorized: false },
      {name: "Fornecedores",      path: "/master-data/suppliers",      code: "B4", pro: false, authorized: false },
    ]
  },
  {
    icon: "MdAttachMoney",
    name: "Financeiro",
    authorized: false,
    code: "D",
    subItems: [
      {name: "Formas de Pagamentos",  path: "/financial/payment-methods",     code: "D1", pro: false, authorized: false },
      {name: "Contas a Receber",      path: "/financial/accounts-receivable", code: "D2", pro: false, authorized: false },
      {name: "Contas a Pagar",        path: "/financial/accounts-payable",    code: "D3", pro: false, authorized: false },
      {name: "Plano de Contas",       path: "/financial/chart-of-accounts",   code: "D4", pro: false, authorized: false },
      {name: "DRE",                   path: "/financial/dre",                 code: "D5", pro: false, authorized: false },
    ]
  },
  {
    icon: "IoBriefcaseOutline",
    name: "Comercial",
    authorized: false,
    code: "E",
    subItems: [
      {name: "Ordem de Serviço",  path: "/commercials/service-orders",     code: "E1", pro: false, authorized: false },
    ]
  }
]);