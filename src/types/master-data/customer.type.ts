export type TCustomer = {
    id?: string;
    tradeName: string;
    corporateName: string;
    document: string;
    type: "J" | "F",
    email: string;
    phone: string
}

export const ResetCustomer: TCustomer = {
    id: "",
    tradeName: "",
    corporateName: "",
    document: "",
    email: "",
    phone: "",
    type: "J"
}