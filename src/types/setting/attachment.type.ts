export type TAttachment = {
    id?: string;
    description: string;
    parent: string;
    parentId: string;
}

export const ResetAttachment: TAttachment = {
    id: "",
    description: "",
    parent: "",
    parentId: ""
}