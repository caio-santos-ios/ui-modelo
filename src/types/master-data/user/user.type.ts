import { ResetAddress, TAddress } from "../address/address";

export type TUser = {
    id: string;
    photo: string;
    name: string;
    email: string;
}

export const ResetUser: TUser = {
    id: "",
    email: "",
    name: "",
    photo: ""
}

export type TUserLogged = {
    photo: string;
    name: string;
    email: string;
}

export const ResetUserLogged: TUserLogged = {
    photo: "",
    name: "",
    email: ""
}

export type TUserProfile = {
    id?: string;
    photo: any;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    
    address: TAddress;
}

export const ResetUserProfile: TUserProfile = {
    id: "",
    photo: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",

    address: ResetAddress
}