import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./AdminVendorManagement.css";

function AdminVendorManagement() {

    const [vendors, setVendors] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const loadVendors = async () => {

            try {

                const response = await api.get("/admin/vendors");

                console.log("ADMIN VENDORS:", response.data);

                setVendors(response.data);

            } catch (error) {

                console.log("VENDOR MANAGEMENT ERROR:", error);

            }
        };

        loadVendors();

    }, []);

    return (

        <AdminLayout>

            <div className="admin-vendors-page">

                <div className="admin-vendors-header">

                    <div>

                        <h1>Vendor Management</h1>

                        <p>
                            View vendor details and monitor vendor status
                        </p>

                    </div>

                    <div className="admin-vendor-count">
                        {vendors.length} Vendors
                    </div>

                </div>


                <div className="admin-vendors-card">

                    <div className="admin-vendors-table-header">

                        <span>Vendor</span>
                        <span>Email</span>
                        <span>Phone</span>
                        <span>Location</span>
                        <span>Status</span>
                        <span>Action</span>

                    </div>


                    {vendors.map((vendor) => (

                        <div
                            className="admin-vendor-row"
                            key={vendor.id}
                        >

                            <div className="admin-vendor-details">

                                <strong>
                                    {vendor.name}
                                </strong>

                                <small>
                                    Vendor ID: #{vendor.id}
                                </small>

                            </div>


                            <span>
                                {vendor.email}
                            </span>


                            <span>
                                {vendor.phoneNumber || "Not provided"}
                            </span>


                            <span>
                                {vendor.city
                                    ? `${vendor.city}${vendor.state
                                        ? ", " + vendor.state
                                        : ""}`
                                    : "Not provided"}
                            </span>


                            <span className="vendor-status active">
                                ACTIVE
                            </span>


                            <button
                                className="view-vendor-button"
                                onClick={() =>
                                    navigate(`/admin/vendors/${vendor.id}`)
                                }
                            >
                                View Details
                            </button>

                        </div>

                    ))}


                    {vendors.length === 0 && (

                        <div className="admin-vendors-empty">
                            No vendors found.
                        </div>

                    )}

                </div>

            </div>

        </AdminLayout>
    );
}

export default AdminVendorManagement;