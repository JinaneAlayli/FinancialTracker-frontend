import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/Transaction.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchData();
    fetchCategories();

    if (searchParams.get("add") === "true") {
      setOpenForm(true);
      setSearchParams({});
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const fixedExpense = await axios.get("http://localhost:5000/expenses", { withCredentials: true });
      const recurringExpense = await axios.get("http://localhost:5000/recurring_expense", { withCredentials: true });

      const combinedData = [...fixedExpense.data, ...recurringExpense.data].filter(item => !item.is_deleted);
      setExpenses(combinedData);
      filterData(combinedData, filter);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching expenses:", err);
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
      filtered = data.filter(expense => expense.date_time); 
    } else if (selectedFilter === "recurring") {
      filtered = data.filter(expense => expense.frequency); 
    }
    setFilteredExpenses(filtered);
    calculateTotal(filtered);
  };

  const calculateTotal = (data) => {
    const total = data.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    setTotalAmount(total);
  };

  useEffect(() => {
    filterData(expenses, filter);
  }, [filter, expenses]);

  const handleDelete = async (id, isRecurring) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      await axios.patch(
        `http://localhost:5000/${isRecurring ? "recurring_expense" : "expenses"}/${id}`,
        { is_deleted: true },
        { withCredentials: true }
      );
      fetchData();
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Failed to delete expense");
    }
  };

  return (
    <DashboardLayout>
      <div className="transaction-container">
        <div className="transaction-header">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Expenses</option>
            <option value="fixed">Fixed Expenses</option>
            <option value="recurring">Recurring Expenses</option>
          </select>
          <button onClick={() => { setSelectedTransaction(null); setOpenForm(true); }}>+ Add Expense</button>
        </div>

        <div className="transaction-summary">Total: ${totalAmount}</div>

        {openForm && <TransactionForm onClose={() => setOpenForm(false)} refreshData={fetchData} type="expense" selectedTransaction={selectedTransaction} />}

        {loading ? (
          <p>Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <p>No expenses found.</p>
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
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title}</td>
                  {filter === "all" && <td>{expense.description || "No description"}</td>} {/* Show only if filter is 'all' */}
                  <td>{expense.amount}</td>
                  <td>{expense.currency}</td>
                  {filter === "fixed" && <td>{expense.date_time}</td>}
                  {filter === "recurring" && (
                    <>
                      <td>{expense.start_date}</td>
                      <td>{expense.end_date}</td>
                      <td>{expense.frequency}</td>
                    </>
                  )}
                  <td>{categories[expense.category_id] || "Uncategorized"}</td>
                  <td>
                    <button onClick={() => { setSelectedTransaction(expense); setOpenForm(true); }}>
                      <Edit />
                    </button>
                    <button onClick={() => handleDelete(expense.id, !!expense.frequency)}>
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
