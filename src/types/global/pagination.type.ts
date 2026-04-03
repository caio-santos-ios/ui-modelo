export type TPagination = {
    data: any[],
    totalPages: number,
    totalCount: number,
    currentPage: number,
    sizePage: number
}

export const ResetPagination: TPagination = {
    data: [],
    totalPages: 0,
    totalCount: 0,
    currentPage: 1,
    sizePage: 10
}