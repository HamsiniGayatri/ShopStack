import { useNavigate } from "react-router-dom";
import "./Auth.css";

function RoleSelection() {

    const navigate = useNavigate();

    return (
        <div className="auth-page">

            <div className="role-container">

                <h2>Welcome to ShopStack</h2>

                <p>Select your account type</p>


                <button 
                    onClick={() => navigate("/login")}
                >
                    Customer
                </button>


                <button 
                    onClick={() => navigate("/vendor/login")}
                >
                    Vendor
                </button>

            </div>

        </div>
    );
}

export default RoleSelection;