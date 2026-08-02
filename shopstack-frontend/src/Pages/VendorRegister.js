import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";


function VendorRegister() {

    const [vendor, setVendor] = useState({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        businessType: "Electronics",
        password: "",
        confirmPassword: ""
    });


    const handleChange = (e) => {
        setVendor({
            ...vendor,
            [e.target.name]: e.target.value
        });
    };


    const handleRegister = async (e) => {

        e.preventDefault();


        if(vendor.password !== vendor.confirmPassword) {
            alert("Passwords do not match");
            return;
        }


        try {

            const response = await api.post("/auth/register", {

                name: vendor.ownerName,

                email: vendor.email,

                password: vendor.password,

                role: "VENDOR"

            });


            console.log(response.data);

            alert("Vendor Registration Successful");


        } catch(error) {

            console.log(error);

            alert("Vendor Registration Failed");

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-container">


                <h2>Vendor Registration</h2>


                <form onSubmit={handleRegister}>


                    <input

                        type="text"

                        name="businessName"

                        placeholder="Business Name"

                        value={vendor.businessName}

                        onChange={handleChange}

                    />



                    <input

                        type="text"

                        name="ownerName"

                        placeholder="Owner Name"

                        value={vendor.ownerName}

                        onChange={handleChange}

                    />



                    <input

                        type="email"

                        name="email"

                        placeholder="Business Email"

                        value={vendor.email}

                        onChange={handleChange}

                    />



                    <input

                        type="tel"

                        name="phone"

                        placeholder="Phone Number"

                        value={vendor.phone}

                        onChange={handleChange}

                    />



                    <select

                        name="businessType"

                        value={vendor.businessType}

                        onChange={handleChange}

                    >

                        <option value="Electronics">
                            Electronics
                        </option>

                        <option value="Fashion">
                            Fashion & Apparel
                        </option>

                        <option value="Home">
                            Home & Furniture
                        </option>

                        <option value="Groceries">
                            Groceries
                        </option>

                        <option value="Books">
                            Books & Stationery
                        </option>

                        <option value="Health">
                            Health & Beauty
                        </option>

                        <option value="Sports">
                            Sports & Fitness
                        </option>

                        <option value="Handmade">
                            Handmade & Crafts
                        </option>

                        <option value="Manufacturer">
                            Manufacturer
                        </option>

                        <option value="Wholesaler">
                            Wholesaler
                        </option>

                        <option value="Other">
                            Other
                        </option>


                    </select>



                    <input

                        type="password"

                        name="password"

                        placeholder="Password"

                        value={vendor.password}

                        onChange={handleChange}

                    />



                    <input

                        type="password"

                        name="confirmPassword"

                        placeholder="Confirm Password"

                        value={vendor.confirmPassword}

                        onChange={handleChange}

                    />



                    <button type="submit">

                        Register as Vendor

                    </button>


                </form>



                <p>

                    Already a vendor?

                    <Link to="/vendor/login">
                        Login
                    </Link>

                </p>



                <p>

                    <Link to="/">
                        ← Back to Role Selection
                    </Link>

                </p>


            </div>

        </div>

    );

}


export default VendorRegister;