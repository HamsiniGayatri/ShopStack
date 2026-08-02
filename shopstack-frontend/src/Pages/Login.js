import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "./Auth.css";

function Login() {

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", loginData);
            console.log(response.data);
            alert(response.data);
        }
        catch(error) {
            console.log(error);
            alert("Login failed");
        }
    };


    return (
    <div className="auth-page">
        <div className="auth-container">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
                </button>

                <p>
                New user?
                <Link to="/register"> Register</Link>
                </p>

            </form>
        </div>
    </div>
    );
}

export default Login;