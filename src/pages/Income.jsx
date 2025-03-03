import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/Transaction.css";
import axios from "axios";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const fixedIncome = await axios.get("http://localhost:5000/incomes", { withCredentials: true });
      const recurringIncome = await axios.get("http://localhost:5000/recurring_income", { withCredentials: true });

      const combinedData = [...fixedIncome.data, ...recurringIncome.data];
      setIncomes(combinedData);
      filterData(combinedData, filter);
      setLoading(false);
    } catch (err) {
      console.error(" Error fetching incomes:", err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/categories", { withCredentials: true });
      const categoryMap = res.data.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
      }, {});
      setCategories(categoryMap);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const filterData = (data, selectedFilter) => {
    let filtered = data;
    if (selectedFilter === "fixed") {
      filtered = data.filter(income => income.date_time);
    } else if (selectedFilter === "recurring") {
      filtered = data.filter(income => income.frequency);
    }
    setFilteredIncomes(filtered);
    calculateTotal(filtered);
  };

  const calculateTotal = (data) => {
    const total = data.reduce((acc, income) => acc + parseFloat(income.amount), 0);
    setTotalAmount(total);
  };

  useEffect(() => {
    filterData(incomes, filter);
  }, [filter, incomes]);

  return (
    <DashboardLayout>
      <div className="transaction-container">
        <div className="transaction-header">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Income</option>
            <option value="fixed">Fixed Income</option>
            <option value="recurring">Recurring Income</option>
          </select>
          <button onClick={() => setOpenForm(true)}>+ Add Income</button>
        </div>

        <div className="transaction-summary">Total: ${totalAmount}</div>

        {openForm && <TransactionForm onClose={() => setOpenForm(false)} refreshData={fetchData} type="income" />}

        {loading ? (
          <p>Loading incomes...</p>
        ) : filteredIncomes.length === 0 ? (
          <p>No incomes found.</p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Currency</th>
                {filter === "fixed" && <th>Date</th>}
                {filter === "recurring" && (
                  <>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Frequency</th>
                  </>
                )}
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map((income, index) => (
                <tr key={index}>
                  <td>{income.title}</td>
                  <td>{income.amount}</td>
                  <td>{income.currency}</td>
                  {filter === "fixed" && <td>{income.date_time}</td>}
                  {filter === "recurring" && (
                    <>
                      <td>{income.start_date}</td>
                      <td>{income.end_date}</td>
                      <td>{income.frequency}</td>
                    </>
                  )}
                  <td>{categories[income.category_id] || "Uncategorized"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
