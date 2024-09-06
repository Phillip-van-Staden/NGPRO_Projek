import React, { useState } from "react";
import './Styles/LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import user_icon from './assets/user.png';
import email_icon from './assets/email.png';
import password_icon from './assets/password.png';
import right_arrow from './assets/right_arrow.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

   const handleSubmit = async () => {
        if (!email || !password || (action === "Sign Up" && !username)) {
            setError("All fields are required.");
            return;
        }

        const url = action === "Sign Up" ? "http://localhost:5000/signup" : "http://localhost:5000/login";
        const payload = action === "Sign Up" ? { username, email, password } : { email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (response.ok) {
                navigate("/dashboard");
            } else {
                console.error("Server error during sign-up or login:", result);
                setError(result.message || "An error occurred");
            }
        } catch (error) {
            console.error("Fetch error during sign-up or login:", error);
            setError("An error occurred while communicating with the server.");
        }
    };
    
    return (
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            {error && <div className="error">{error}</div>}
            <div className="inputs">
                {action === "Login" ? null : (
                    <div className="input">
                        <img src={user_icon} alt="user-icon" />
                        <input
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                )}
                <div className="input">
                    <img src={email_icon} alt="email-icon" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input">
                    <img src={password_icon} alt="password-icon" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            {action === "Sign Up" ? null : <div className="forgot-password">Forgot password?</div>}
            <div className="submit-container">
                <button className={action === "Sign Up" ? "button gray" : "submit"} onClick={() => setAction("Login")}>Login</button>
                <button className={action === "Login" ? "button gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</button>
                <button className="next" onClick={handleSubmit}>Next<img src={right_arrow} alt="next-icon" /></button>
            </div>
        </div>
    );
};

export default LoginSignup;