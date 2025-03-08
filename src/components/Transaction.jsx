import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import DashboardLayout from "../layouts/DashboardLayout";
import styles from "../styles/Transaction.module.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { FiEdit, FiTrash2, FiChevronDown } from "react-icons/fi";
import incomeIcon from "../assets/income.png";
import expenseIcon from "../assets/expense.png";
import { API_URL } from "../config/api";

export default function Transaction({ type }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const isIncome = type === "income";

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchTotals();
    if (searchParams.get("add") === "true") {
      setOpenForm(true);
      setSearchParams({});
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const fixedData = await axios.get(`${API_URL}/${type}s`, { withCredentials: true });
      const recurringData = await axios.get(`${API_URL}/recurring_${type}`, { withCredentials: true });
      const combinedData = [...fixedData.data, ...recurringData.data].filter(item => !item.is_deleted);
      setTransactions(combinedData);
      filterData(combinedData, filter);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`, { withCredentials: true });
      const categoryMap = res.data.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
      }, {});
      setCategories(categoryMap);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchTotals = async () => {
    try {
      const response = await axios.get(`${API_URL}/totals`, { withCredentials: true });
      const data = response.data;
      if (filter === "all") {
        setTotalAmount(isIncome ? data.totalIncome : data.totalExpense);
      } else if (filter === "fixed") {
        setTotalAmount(isIncome ? data.totalFixedIncome : data.totalFixedExpense);
      } else if (filter === "recurring") {
        setTotalAmount(isIncome ? data.totalRecurringIncome : data.totalRecurringExpense);
      }
    } catch (err) {
      console.error("Error fetching totals:", err);
    }
  };

  const filterData = (data, selectedFilter) => {
    let filtered = data;
    if (selectedFilter === "fixed") {
      filtered = data.filter(item => item.date_time);
    } else if (selectedFilter === "recurring") {
      filtered = data.filter(item => item.frequency);
    }
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    filterData(transactions, filter);
    fetchTotals();
  }, [filter, transactions]);

  const handleDelete = async (id, isRecurring) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.patch(
        `${API_URL}/${isRecurring ? `recurring_${type}` : `${type}s`}/${id}`,
        { is_deleted: true },
        { withCredentials: true }
      );
      fetchData();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete");
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.transactionContainer}>
        <div className={styles.filterContainer}>
          <div className={styles.filterWrapper}>
            <select
              className={styles.filterSelect}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="fixed">Fixed</option>
              <option value="recurring">Recurring</option>
            </select>
            <FiChevronDown className={styles.filterIcon} />
          </div>
          <button className={styles.addButton} onClick={() => { setSelectedTransaction(null); setOpenForm(true); }}>+ New</button>
        </div>

        <div className={styles.transactionHeader}>
          <div className={styles.totalBox}>
            <img src={isIncome ? incomeIcon : expenseIcon} alt="icon" className={styles.icon} />
            <div>
              <h3>{isIncome ? "Total Income" : "Total Expenses"}</h3>
              <p>${totalAmount}</p>
            </div>
          </div>
        </div>

        {openForm && <TransactionForm onClose={() => setOpenForm(false)} refreshData={fetchData} type={type} selectedTransaction={selectedTransaction} />}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.transactionTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Category</th>
                {filter === "fixed" && <th>Date</th>}
                {filter === "recurring" && (
                  <>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Frequency</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>No transactions found.</td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.title}</td>
                    <td>{transaction.description || "No description"}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.currency}</td>
                    <td>{categories[transaction.category_id] || "Uncategorized"}</td>
                    {filter === "fixed" && <td>{transaction.date_time}</td>}
                    {filter === "recurring" && (
                      <>
                        <td>{transaction.start_date}</td>
                        <td>{transaction.end_date}</td>
                        <td>{transaction.frequency}</td>
                      </>
                    )}
                    <td>
                      <button className={styles.editButton} onClick={() => { setSelectedTransaction(transaction); setOpenForm(true); }}>
                        <FiEdit />
                      </button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(transaction.id, !!transaction.frequency)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
