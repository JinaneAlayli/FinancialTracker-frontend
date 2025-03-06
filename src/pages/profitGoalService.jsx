import axios from "axios";

const API_URL = "http://localhost:5000/profitgoals"; // Change if needed

// Get all profit goals
export const fetchProfitGoals = async () => {
    try {
        const response = await axios.get(API_URL, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching profit goals:", error);
        throw error;
    }
};

// Create a new profit goal
export const createProfitGoal = async (profitGoal) => {
    try {
        const response = await axios.post(API_URL, profitGoal, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error creating profit goal:", error);
        throw error;
    }
};

// Update a profit goal
export const updateProfitGoal = async (id, profitGoal) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, profitGoal, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error updating profit goal:", error);
        throw error;
    }
};

// Delete a profit goal
export const deleteProfitGoal = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    } catch (error) {
        console.error("Error deleting profit goal:", error);
        throw error;
    }
};