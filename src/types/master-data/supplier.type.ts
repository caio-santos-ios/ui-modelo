export type TSupplier = {
    id?: string;
    tradeName: string;
    corporateName: string;
    document: string;
    type: "J" | "F",
    email: string;
    phone: string
}

export const ResetSupplier: TSupplier = {
    id: "",
    tradeName: "",
    corporateName: "",
    document: "",
    email: "",
    phone: "",
    type: "J"
}