import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import {
    Container, Typography, TextField, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "../layouts/DashboardLayout";
import styles from "../styles/Categories.module.css";
 

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
            const response = await axios.get(`${API_URL}/categories`, { withCredentials: true });
            setCategories(response.data);
        } catch (err) {
            setError(err.response?.data?.msg || "Error fetching categories");
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim() || !categoryType) return;
        try {
            await axios.post(`${API_URL}/categories`, { name: newCategory, type: categoryType}, { withCredentials: true });
            setNewCategory("");
            setCategoryType("");
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.msg || "Error adding category");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/categories/${id}`, { withCredentials: true });
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.msg || "Error deleting category");
        }
    };

    return (
        <DashboardLayout>
        <Container maxWidth="md">
            <TextField 
                label="New Category" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                sx={{ width: "60%" }}
                margin="normal"
            />
            <FormControl sx={{ width: "60%" }} margin="normal">
                <InputLabel>Category Type</InputLabel>
                <Select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                </Select>
            </FormControl>
            <div><Button sx={{ color:"white", backgroundColor:"#ff9a00", }} className={styles.addButton} onClick={handleAddCategory}>
                Add Category
            </Button></div>

            {error && <Typography color="error">{error}</Typography>}

            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead className={styles.tableHead}>
                        <TableRow>
                            <TableCell sx={{ color:"white" }}>ID</TableCell>
                            <TableCell sx={{ color:"white" }}>Name</TableCell>
                            <TableCell sx={{ color:"white" }}>Type</TableCell>
                            <TableCell sx={{ color:"white" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id} className={styles.tableRow}>
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