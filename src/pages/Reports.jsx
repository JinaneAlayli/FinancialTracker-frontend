import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Select, MenuItem } from "@mui/material";
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
            const response = await axios.get(`${API_URL}/reports?filter=${filter}`, { withCredentials: true });
            setReportData(response.data);
        } catch (err) {
            console.error("Error fetching report:", err);
        }
    };

    if (!reportData) return <p>Loading...</p>;

    // Chart Options (Smaller Size)
    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

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
                borderWidth: 2,
                fill: false,
            },
            {
                label: "Expense",
                data: expenseAmounts,
                borderColor: "#FF6384",
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    return (
        <DashboardLayout>
            <div>
                <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    sx={{ marginBottom: 3, width: "200px" }}
                >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                </Select>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Income vs. Expenses</Typography>
                                <div style={{ height: "200px" }}>
                                    <Pie data={pieData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Net Profit</Typography>
                                <div style={{ height: "200px" }}>
                                    <Bar data={barData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Income & Expenses Over Time</Typography>
                                <div style={{ height: "250px" }}>
                                    <Line data={lineData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </DashboardLayout>
    );
};

export default Reports;