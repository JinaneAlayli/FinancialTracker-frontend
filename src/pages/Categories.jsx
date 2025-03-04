import { useState, useEffect } from "react";
import axios from "axios";
import {
    Container, Typography, TextField, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "../layouts/DashboardLayout";

const API_URL = "http://localhost:5000/categories";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [categoryType, setCategoryType] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(API_URL, { withCredentials: true });
            setCategories(response.data);
        } catch (err) {
            setError(err.response?.data?.msg || "Error fetching categories");
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim() || !categoryType) return;
        try {
            await axios.post(API_URL, { name: newCategory, type: categoryType}, { withCredentials: true });
            setNewCategory("");
            setCategoryType("");
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.msg || "Error adding category");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.msg || "Error deleting category");
        }
    };

    return (
        <DashboardLayout>
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Categories</Typography>
            
            <TextField 
                label="New Category" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                fullWidth 
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Category Type</InputLabel>
                <Select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleAddCategory}>
                Add Category
            </Button>

            {error && <Typography color="error">{error}</Typography>}

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.type}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDelete(category.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
        </DashboardLayout>
    );
}