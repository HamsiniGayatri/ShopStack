import api from "../services/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

function Register() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });
    //axios.post("http://localhost:8080/auth/register", userData);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/register", user);
            console.log(response.data);
            alert("Registration successful");
        } 
        catch(error) {
            console.log(error);
            alert("Registration failed");
        }
    };

    return (
    <div className="auth-page">
        <div className="auth-container">
            <h2>Register</h2>

            <form onSubmit={handleRegister}>

                <input
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                />

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
                    Register
                </button>

                <p>
                Already have an account?
                <Link to="/login"> Login</Link>
                </p>

            </form>
        </div>
    </div>
    );
}

export default Register;