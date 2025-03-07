export default function getMotivationMessage(totals) {
  const { totalIncome, totalExpense, netProfit } = totals;
  
  if (netProfit > 0) {
    return "Great job! You're on track to reach your profit goal! ";
  } else if (netProfit === 0) {
    return "You're breaking even. Keep pushing to increase your profit! ";
  } else {
    return "Warning: Expenses are exceeding income! Consider adjusting your budget. ";
  }
}
