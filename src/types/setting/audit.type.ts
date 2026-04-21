export type TAuditSearch = {
    method: string;
    statusCode: any;
    createdBy: string;
}

export const ResetAuditSearch: TAuditSearch = {
    method: "",
    statusCode: "",
    createdBy: ""
}