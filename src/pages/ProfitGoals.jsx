import { useEffect, useState } from "react";
import {
    fetchProfitGoals,
    createProfitGoal,
    updateProfitGoal,
    deleteProfitGoal
} from "./profitGoalService.jsx";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout"; 

const ProfitGoals = () => {
    const [profitGoals, setProfitGoals] = useState([]);
    const [form, setForm] = useState({ target_amount: "", currency: "", target_date: "" });
    const [editingId, setEditingId] = useState(null);
 
    useEffect(() => {
        loadProfitGoals();
    }, []);

    const loadProfitGoals = async () => {
        try {
            const data = await fetchProfitGoals();
            setProfitGoals(data);
        } catch (error) {
            console.error("Failed to load profit goals");
        }
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateProfitGoal(editingId, form);
            } else {
                await createProfitGoal(form);
            }
            setForm({ target_amount: "", currency: "", target_date: "" });
            setEditingId(null);
            loadProfitGoals();
        } catch (error) {
            console.error("Error saving profit goal");
        }
    };

    const handleEdit = (goal) => {
        setForm(goal);
        setEditingId(goal.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            try {
                await deleteProfitGoal(id);
                loadProfitGoals();
            } catch (error) {
                console.error("Error deleting profit goal");
            }
        }
    };

    return (
        <DashboardLayout>
            <div>
                <h2></h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <TextField
                        label="Target Amount"
                        type="number"
                        name="target_amount"
                        value={form.target_amount}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Currency"
                        name="currency"
                        value={form.currency}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Date"
                        type="date"
                        name="target_date"
                        value={form.target_date}
                        onChange={handleInputChange}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {editingId ? "Update" : "Add"}
                    </Button>
                </form>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Target Amount</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {profitGoals.map((goal) => (
                                <TableRow key={goal.id}>
                                    <TableCell>{goal.id}</TableCell>
                                    <TableCell>{goal.target_amount}</TableCell>
                                    <TableCell>{goal.currency}</TableCell>
                                    <TableCell>{goal.target_date}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(goal)} variant="outlined" color="secondary">
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(goal.id)} variant="outlined" color="error" style={{ marginLeft: "10px" }}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </DashboardLayout>
    );
};

export default ProfitGoals;