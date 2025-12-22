import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/admin');
        }
    }, [user, loading, navigate]);

    const validate = () => {
        const newErrors = {};

        // Email Regex: Standard format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password Regex: Min 8 chars only
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors
        if (validate()) {
            try {
                await login(email, password);
                navigate('/admin'); // Redirect to admin home on success
            } catch (err) {
                // The backend returns 401 on bad credentials
                setErrors({ form: 'Invalid email or password' });
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.title}>Admin Login</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    {errors.email || errors.password || errors.form ? (
                        <p className={styles.errorText}>
                            {errors.email || errors.password || errors.form}
                        </p>
                    ) : null}
                    <button type="submit" className='button' style={{ width: '100%' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;