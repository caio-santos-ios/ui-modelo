export type TFilterDashboard = {
    startDate: any;
    endDate: any;
}

export const ResetFilterDashboard: TFilterDashboard = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0]
}