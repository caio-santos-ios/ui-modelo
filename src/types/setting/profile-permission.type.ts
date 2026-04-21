export type TProfileUser = {
    id?: string;
    code: string;
    name: string;
    description: string;
    createdAt: string;
    modules: TModule[];
}

export const ResetProfileUser: TProfileUser = {
    id: "",
    name: "",
    code: "",
    createdAt: "",
    description: "",
    modules: [],
}

export type TRoutine = {
    module: string;
    code: string;
    description: string;
    permissions: {
        create: boolean;
        update: boolean;
        read: boolean;
        delete: boolean;
    }
}

export type TModule = {
    id: string;
    Code: string;
    Description: string;
    Routines: TRoutine[]
}

export const ResetModule: TModule = {
    id: "",
    Code: "",
    Description: "",
    Routines: []
}