export type TDashboardAccountReceivableCard = {
    openAmount: number;
    openCount: number;
    overdueAmount: number;
    overdueCount: number;
    cancelAmount: number;
    cancelCount: number;
    totalAmount: number;
    totalCount: number;
};

export const ResetDashboardAccountReceivableCard: TDashboardAccountReceivableCard = {
    openAmount: 0,
    openCount: 0,
    overdueAmount: 0,
    overdueCount: 0,
    cancelAmount: 0,
    cancelCount: 0,
    totalAmount: 0,
    totalCount: 0
}