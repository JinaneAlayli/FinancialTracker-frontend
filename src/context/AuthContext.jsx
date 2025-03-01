import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/me", { withCredentials: true })
      .then((res) => {
        
        setUser(res.data);
      })
      .catch(() => {
        
        setUser(null);
      })
      .finally(() => setLoading(false)); 
  }, []);

  const login = (userData) => {
    setUser(userData); 
  };

  const logout = () => {
    axios.post("http://localhost:5000/users/logout", {}, { withCredentials: true }).then(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
