export type TDashboardCashFlowCard = {
    entries: number;
    exits: number;
    balance: number;
};

export const ResetDashboardCashFlowCard: TDashboardCashFlowCard = {
    entries: 0,
    exits: 0,
    balance: 0
}