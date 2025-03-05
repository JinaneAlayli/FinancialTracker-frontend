import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/Transaction.css";
import axios from "axios";
import { Edit, Delete } from "@mui/icons-material";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
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

      const combinedData = [...fixedIncome.data, ...recurringIncome.data].filter(item => !item.is_deleted);
      setIncomes(combinedData);
      filterData(combinedData, filter);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching incomes:", err);
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

  const handleDelete = async (id, isRecurring) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await axios.patch(
        `http://localhost:5000/${isRecurring ? "recurring_income" : "incomes"}/${id}`,
        { is_deleted: true },
        { withCredentials: true }
      );
      fetchData();
    } catch (err) {
      console.error("Error deleting income:", err);
      alert("Failed to delete income");
    }
  };

  return (
    <DashboardLayout>
      <div className="transaction-container">
        <div className="transaction-header">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Income</option>
            <option value="fixed">Fixed Income</option>
            <option value="recurring">Recurring Income</option>
          </select>
          <button onClick={() => { setSelectedTransaction(null); setOpenForm(true); }}>+ Add Income</button>
        </div>

        <div className="transaction-summary">Total: ${totalAmount}</div>

        {openForm && <TransactionForm onClose={() => setOpenForm(false)} refreshData={fetchData} type="income" selectedTransaction={selectedTransaction} />}

        {loading ? (
          <p>Loading incomes...</p>
        ) : filteredIncomes.length === 0 ? (
          <p>No incomes found.</p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Title</th>
                {filter === "all" && <th>Description</th>} {/* Show Description only for 'all' filter */}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map((income) => (
                <tr key={income.id}>
                  <td>{income.title}</td>
                  {filter === "all" && <td>{income.description || "No description"}</td>} {/* Show only if filter is 'all' */}
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
                  <td>
                    <button onClick={() => { setSelectedTransaction(income); setOpenForm(true); }}>
                      <Edit />
                    </button>
                    <button onClick={() => handleDelete(income.id, !!income.frequency)}>
                      <Delete style={{ color: "red" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
