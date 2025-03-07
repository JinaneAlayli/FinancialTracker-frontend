import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfitCharts from "../components/ProfitCharts";
import getMotivationMessage from "../utils/getMotivationMessage";
import axios from "axios";
import { API_URL } from "../config/api";
import styles from "../styles/Home.module.css";
import hiIcon from "../assets/hi.png";
import transactionBg from "../assets/transaction.png";

export default function Home() {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (selectedGoal) fetchGoalTotals(selectedGoal);
  }, [selectedGoal]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${API_URL}/profitgoals`, { withCredentials: true });
      setGoals(Array.isArray(res.data) ? res.data : []);
      if (res.data.length > 0) {
        setSelectedGoal(res.data[0].id);  
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

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.welcomeBox} style={{ backgroundImage: `url(${transactionBg})` }}>
          <img src={hiIcon} alt="Hi" className={styles.hiIcon} />
          <div>
            <h2>Hi, Admin</h2>
            <p className={styles.date}>{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className={styles.goalSelectContainer}>
          <label>Select a Profit Goal:</label>
          <select
            className={styles.goalSelect}
            value={selectedGoal || ""}
            onChange={(e) => setSelectedGoal(e.target.value)}
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
        ) : totals ? (
          <ProfitCharts totals={totals} />
        ) : (
          <p>No data available for this goal.</p>
        )}

        {totals && <p className={styles.motivation}>{getMotivationMessage(totals)}</p>}
      </div>
    </DashboardLayout>
  );
}
