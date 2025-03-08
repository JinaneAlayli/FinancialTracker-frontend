import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfitCharts from "../components/ProfitCharts";
import getMotivationMessage from "../utils/getMotivationMessage";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../config/api";
import styles from "../styles/Home.module.css";
import { FiTrendingDown, FiTrendingUp, FiClock } from "react-icons/fi";
import hiIcon from "../assets/hi.png";
import transactionBg from "../assets/transaction.png";

export default function Home() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goalAmount, setGoalAmount] = useState(0);
  const [reminders, setReminders] = useState({ upcomingIncomes: [], upcomingExpenses: [] });

  useEffect(() => {
    fetchGoals();
    fetchReminders();
  }, []);

  useEffect(() => {
    if (selectedGoal) fetchGoalTotals(selectedGoal);
  }, [selectedGoal]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${API_URL}/profitgoals`, { withCredentials: true });
      setGoals(res.data);
      if (res.data.length > 0) {
        setSelectedGoal(res.data[0].id);
        setGoalAmount(res.data[0].target_amount);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  const fetchGoalTotals = async (goalId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/goal-totals/${goalId}`, { withCredentials: true });
      setTotals(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching goal totals:", err);
      setLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${API_URL}/reminders`, { withCredentials: true });
      setReminders(res.data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
      <div className={styles.welcomeBox}>
        <img src={hiIcon} alt="Hi" className={styles.hiIcon} />
        <div className={styles.greetingText}>
          <h2>Hi, {user?.name || "User"}</h2>
          <p className={styles.date}>{new Date().toLocaleDateString()}</p> 
        </div>
      </div>


        {totals && (
          <div className={styles.motivationBox}>
            <p>{getMotivationMessage(totals, goalAmount)}</p>
          </div>
        )}

        <div className={styles.goalSelectContainer}>
          <label>Select a Profit Goal:</label>
          <select
            className={styles.goalSelect}
            value={selectedGoal || ""}
            onChange={(e) => {
              const selected = goals.find((goal) => goal.id === parseInt(e.target.value));
              setSelectedGoal(selected.id);
              setGoalAmount(selected.target_amount);
            }}
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.target_amount} {goal.currency} - {goal.target_date}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
  <p>Loading charts...</p>
) : totals && (totals.totalIncome > 0 || totals.totalExpense > 0) ? (
  <ProfitCharts totals={totals} />
) : (
  <div className={styles.noDataMessage}>
      
    <p>No data yet!</p>
  </div>
)}

        {/*reminder  */}
        <div className={styles.reminderContainer}>
  <h3><FiClock /> Upcoming Payments & Incomes</h3>
  {reminders.upcomingIncomes.length === 0 && reminders.upcomingExpenses.length === 0 ? (
    <p>No upcoming transactions in the next 3 days.</p>
  ) : (
    <div className={styles.reminderGrid}>
      {reminders.upcomingIncomes.map((income) => (
        <div key={income.id} className={styles.incomeBox}>
          <FiTrendingUp className={styles.incomeIcon} />
          <div>
            <p>{income.title}</p>
            <small>{income.amount} {income.currency} - {income.nextDueDate}</small> {/* No .toISOString() */}
          </div>
        </div>
      ))}
      {reminders.upcomingExpenses.map((expense) => (
        <div key={expense.id} className={styles.expenseBox}>
          <FiTrendingDown className={styles.expenseIcon} />
          <div>
            <p>{expense.title}</p>
            <small>{expense.amount} {expense.currency} - {expense.nextDueDate}</small> {/* No .toISOString() */}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      </div>
    </DashboardLayout>
  );
}
