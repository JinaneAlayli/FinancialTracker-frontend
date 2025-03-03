import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/Transaction.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
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

      const combinedData = [...fixedExpense.data, ...recurringExpense.data];
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

  return (
    <DashboardLayout>
      <div className="transaction-container">
        <div className="transaction-header">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Expenses</option>
            <option value="fixed">Fixed Expenses</option>
            <option value="recurring">Recurring Expenses</option>
          </select>
          <button onClick={() => setOpenForm(true)}>+ Add Expense</button>
        </div>

        <div className="transaction-summary">Total: ${totalAmount}</div>

        {openForm && <TransactionForm onClose={() => setOpenForm(false)} refreshData={fetchData} type="expense" />}

        {loading ? (
          <p>Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <p>No expenses found.</p>
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
              {filteredExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.title}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
