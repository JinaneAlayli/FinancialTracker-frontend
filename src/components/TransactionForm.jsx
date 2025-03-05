import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TransactionForm.css";

export default function TransactionForm({ onClose, refreshData, type, selectedTransaction }) {
  const isIncome = type === "income";
  const isEdit = !!selectedTransaction;
  const [activeTab, setActiveTab] = useState("fixed");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      loadTransactionData();
    } else {
      resetForm();
    }
  }, [selectedTransaction]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/categories", { withCredentials: true });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const loadTransactionData = () => {
    setTitle(selectedTransaction.title || "");
    setDescription(selectedTransaction.description || "");
    setAmount(selectedTransaction.amount || "");
    setCurrency(selectedTransaction.currency || "USD");
    setCategory(selectedTransaction.category_id || "");

    if (selectedTransaction.date_time) {
      setActiveTab("fixed");
      setDateTime(selectedTransaction.date_time.split("T")[0]); // Fix date display issue
    } else {
      setActiveTab("recurring");
      setFrequency(selectedTransaction.frequency || "monthly");
      setStartDate(selectedTransaction.start_date || "");
      setEndDate(selectedTransaction.end_date || "");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAmount("");
    setCurrency("USD");
    setCategory("");
    setDateTime("");
    setFrequency("monthly");
    setStartDate("");
    setEndDate("");
    setActiveTab("fixed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const baseData = { title, description, amount, currency, category_id: category };

    try {
      if (isEdit) {
        if (activeTab === "fixed") {
          baseData.date_time = dateTime;
          await axios.put(`http://localhost:5000/${type}s/${selectedTransaction.id}`, baseData, { withCredentials: true });
        } else {
          baseData.frequency = frequency;
          baseData.start_date = startDate;
          baseData.end_date = endDate;
          await axios.put(`http://localhost:5000/recurring_${type}/${selectedTransaction.id}`, baseData, { withCredentials: true });
        }
      } else {
        if (activeTab === "fixed") {
          baseData.date_time = dateTime;
          await axios.post(`http://localhost:5000/${type}s`, baseData, { withCredentials: true });
        } else {
          baseData.frequency = frequency;
          baseData.start_date = startDate;
          baseData.end_date = endDate;
          await axios.post(`http://localhost:5000/recurring_${type}`, baseData, { withCredentials: true });
        }
      }

      onClose();
      refreshData();
      resetForm(); // Reset form after successful submission
    } catch (err) {
      console.error("Error in Request:", err.response?.data || err);
      setError(err.response?.data?.error || "Operation failed");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>{isEdit ? "Edit Transaction" : "Add Transaction"}</h2>

        {error && <p className="error-message">{error}</p>}

        {!isEdit && (
          <div className="tab-switch">
            <button className={activeTab === "fixed" ? "active" : ""} onClick={() => setActiveTab("fixed")}>
              {isIncome ? "Fixed Income" : "Fixed Expense"}
            </button>
            <button className={activeTab === "recurring" ? "active" : ""} onClick={() => setActiveTab("recurring")}>
              {isIncome ? "Recurring Income" : "Recurring Expense"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />

          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="LBP">LBP</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {activeTab === "fixed" && (
            <input type="date" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
          )}

          {activeTab === "recurring" && (
            <>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </>
          )}

          <button type="submit">{isEdit ? "Save Changes" : "Save"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
