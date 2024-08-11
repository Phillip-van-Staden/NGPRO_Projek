import React, { useState } from "react";
import './LoginSignup.css';
import user_icon from './assets/user.png';
import email_icon from './assets/email.png';
import password_icon from './assets/password.png';
import right_arrow from './assets/right_arrow.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");
    return (
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Login" ? <div></div> :
                    <div className="input">
                        <img 
                            src={user_icon}
                        />
                        <input
                            type="text"
                            placeholder="Name"
                        />
                    </div>
                }
                <div className="input">
                    <img 
                        src={email_icon}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                    />
                </div>
                <div className="input">
                    <img 
                        src={password_icon}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                    />
                </div>
            </div>
            {action === "Sign Up" ? <div></div>:
                <div className="forgot-password">Forgot password?</div>
            }
            <div className="submit-container">
                <button className={action === "Sign Up"?"button gray":"submit"} onClick={()=>{setAction("Login")}}>Login</button>
                <button className={action === "Login"?"button gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</button>
                <button className="next">Next<img src={right_arrow}/></button>

            </div>
        </div>
    )
}

export default LoginSignup;