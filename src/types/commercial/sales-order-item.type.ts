export type TServiceOrderItem = {
    id: string;
    itemType: string;
    quantity: number;
    price: number;
    status: string;
    openingDate: any,
    forecasDate: any,
    endDate: any,
    priority: "Baixa" | "Normal" | "Alta" | "Urgente";
    description: string;
    notes: string;
}

export const ResetServiceOrderItem: TServiceOrderItem = {
    id: "",
    itemType: "",
    quantity: 0,
    price: 0,
    status: "Em Aberto",
    openingDate: null,
    forecasDate: null,
    endDate: null,
    priority: "Normal",
    description: "",
    notes: ""
}