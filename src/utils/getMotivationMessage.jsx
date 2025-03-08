import { FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiThumbsUp, FiTarget, FiXCircle, FiBarChart } from "react-icons/fi";

export default function getMotivationMessage(totals, goalAmount) {
  if (!totals || !goalAmount || goalAmount <= 0) {
    return (
      <>
        <FiTarget /> <strong>No goal set!</strong> Start tracking your goals to see progress.
      </>
    );
  }

  const { totalIncome, totalExpense } = totals;
  const progressPercentage = Math.min(((totalIncome / goalAmount) * 100).toFixed(2), 100);
  const remainingAmount = Math.max(goalAmount - totalIncome, 0);
  const expenseRatio = totalExpense > 0 ? ((totalExpense / totalIncome) * 100).toFixed(2) : 0;

  if (totalIncome === 0 && totalExpense === 0) {
    return (
      <>
        <FiBarChart style={{ color: "gray" }} /> <strong>No data yet!</strong> Start tracking income and expenses.
      </>
    );
  }

  if (totalExpense > totalIncome) {
    return (
      <>
        <FiAlertTriangle style={{ color: "red" }} /> <strong>Overspending!</strong>  
        You are at <strong style={{ fontSize: "22px", fontWeight: "bold", color: "red" }}>{expenseRatio}%</strong>  
        of your income.
      </>
    );
  }

  return (
    <>
      {progressPercentage >= 100 ? (
        <>
          <FiCheckCircle style={{ color: "green" }} /> <strong>Goal Achieved!</strong>  
          You hit <strong style={{ fontSize: "22px", fontWeight: "bold", color: "green" }}>100%</strong>!
        </>
      ) : progressPercentage >= 75 ? (
        <>
          <FiTrendingUp style={{ color: "blue" }} /> <strong>Almost there!</strong>  
          You're at <strong style={{ fontSize: "22px", fontWeight: "bold", color: "blue" }}>{progressPercentage}%</strong>.  
          <br /> Only <strong>${remainingAmount}</strong> left!
        </>
      ) : progressPercentage >= 50 ? (
        <>
          <FiThumbsUp style={{ color: "blue" }} /> <strong>Halfway!</strong>  
          You are <strong style={{ fontSize: "22px", fontWeight: "bold", color: "blue" }}>{progressPercentage}%</strong> there!
        </>
      ) : progressPercentage >= 25 ? (
        <>
          <FiTrendingUp style={{ color: "orange" }} /> <strong>Good start!</strong>  
          You reached <strong style={{ fontSize: "22px", fontWeight: "bold", color: "orange" }}>{progressPercentage}%</strong>.
        </>
      ) : (
        <>
          <FiXCircle style={{ color: "red" }} /> <strong>Just starting!</strong>  
          You are at <strong style={{ fontSize: "22px", fontWeight: "bold", color: "red" }}>{progressPercentage}%</strong> of your goal.
        </>
      )}
    </>
  );
}
