import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Pie, Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { API_URL } from "../config/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";
import DashboardLayout from "../layouts/DashboardLayout";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);
 

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [filter, setFilter] = useState("monthly");

    useEffect(() => {
        fetchReport();
    }, [filter]);

    const fetchReport = async () => {
        try {
            const response = await axios.get(`${API_URL}?filter=${filter}`,{ withCredentials: true });
            setReportData(response.data);
        } catch (err) {
            console.error("Error fetching report:", err);
        }
    };

    if (!reportData) return <p>Loading...</p>;

    // Prepare Pie Chart Data (Income vs. Expenses)
    const pieData = {
        labels: ["Total Income", "Total Expense"],
        datasets: [
            {
                data: [reportData.totalIncome, reportData.totalExpense],
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    // Prepare Bar Chart Data (Net Profit)
    const barData = {
        labels: [filter],
        datasets: [
            {
                label: "Net Profit",
                data: [reportData.netProfit],
                backgroundColor: "#4CAF50",
            },
        ],
    };

    // Prepare Line Chart Data (Income & Expense Over Time)
    const transactionDates = reportData.transactions.income.map((item) => item.date_time);
    const incomeAmounts = reportData.transactions.income.map((item) => item.amount);
    const expenseAmounts = reportData.transactions.expense.map((item) => item.amount);

    const lineData = {
        labels: transactionDates,
        datasets: [
            {
                label: "Income",
                data: incomeAmounts,
                borderColor: "#36A2EB",
                fill: false,
            },
            {
                label: "Expense",
                data: expenseAmounts,
                borderColor: "#FF6384",
                fill: false,
            },
        ],
    };

    return (
        <DashboardLayout>
            <div>
                <Typography variant="h4">Reports</Typography>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>

                <Grid container spacing={3} style={{ marginTop: "20px" }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Income vs. Expenses</Typography>
                                <Pie data={pieData} />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Net Profit</Typography>
                                <Bar data={barData} />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Income & Expenses Over Time</Typography>
                                <Line data={lineData} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </DashboardLayout>
    );
};

export default Reports;