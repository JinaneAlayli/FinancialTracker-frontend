  import { useState, useRef, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import styles from "../styles/Header.module.css";
  import { useAuth } from "../context/AuthContext";
  import { FiUser, FiPlus, FiUsers, FiMenu } from "react-icons/fi";
  import logo from "../assets/logo.png";

  export default function Header({ onMenuToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [plusOpen, setPlusOpen] = useState(false);
    const menuRef = useRef(null);
    const plusRef = useRef(null);

    const handleLogout = () => {
      logout();
      navigate("/login");
    };

    useEffect(() => {
      function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
        if (plusRef.current && !plusRef.current.contains(event.target)) {
          setPlusOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <button className={styles.menuButton} onClick={onMenuToggle}>
            <FiMenu size={24} />
          </button>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>
        
        <div className={styles.iconContainer}>
          <div ref={plusRef} className={styles.plusButtonContainer}>
            <button className={styles.plusButton} onClick={() => setPlusOpen(!plusOpen)}>
              <FiPlus size={20} />
            </button>
            {plusOpen && (
              <div className={styles.profileDropdown}>
                <button onClick={() => navigate("/expenses?add=true")} className={styles.dropdownItem}>Add Expense</button>
                <button onClick={() => navigate("/incomes?add=true")} className={styles.dropdownItem}>Add Income</button>
                {user?.role === "super_admin" && (
                  <button onClick={() => navigate("/manage-admins?add=true")} className={styles.dropdownItem}>Add Admin</button>
                )}
              </div>
            )}
          </div>

          {user?.role === "super_admin" && (
            <button className={styles.iconButton} onClick={() => navigate("/manage-admins")}> 
              <FiUsers size={20} />
            </button>
          )}

          <div ref={menuRef} className={styles.profileMenuContainer}>
            <button className={styles.iconButton} onClick={() => setMenuOpen(!menuOpen)}>
              <FiUser size={20} />
            </button>
            {menuOpen && (
              <div className={styles.profileDropdown}>
  <p className={styles.profileName}>{user?.email || "Unknown User"}</p>
  <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
