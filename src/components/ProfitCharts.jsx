import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import styles from "../styles/ProfitCharts.module.css";

export default function ProfitCharts({ totals }) {
  const barData = [
    { name: "Income", amount: totals.totalIncome, color: "#219EBC" },
    { name: "Expense", amount: totals.totalExpense, color: "#FFB703" },
  ];

  const pieData = [
    { name: "Fixed Income", value: totals.totalFixedIncome, color: "#4CAF50" },
    { name: "Recurring Income", value: totals.totalRecurringIncome, color: "#6A0DAD" }, 
    { name: "Fixed Expense", value: totals.totalFixedExpense, color: "#FB8500" },
    { name: "Recurring Expense", value: totals.totalRecurringExpense, color: "#0077B6" }, 
  ];
 
  const totalPie = pieData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className={styles.chartContainer}>
     
      <ResponsiveContainer width="50%" height={300}>
        <BarChart data={barData}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, "dataMax + 10"]} tickCount={5} />
          <Tooltip />
          <Bar dataKey="amount">
            {barData.map((entry, index) => (
              <Cell key={`bar-cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
 
      <div className={styles.pieChartContainer}>
        <ResponsiveContainer width={250} height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
 
        <div className={styles.legend}>
          {pieData.map((entry, index) => (
            <div key={index} className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {(entry.value / totalPie * 100).toFixed(1)}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
