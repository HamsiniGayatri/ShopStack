import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";
import "./AdminVendorDetails.css";

function AdminVendorDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [vendor, setVendor] = useState(null);

    useEffect(() => {

        const loadVendor = async () => {

            try {

                const response = await api.get(
                    `/admin/vendors/${id}`
                );

                console.log("VENDOR DETAILS:", response.data);

                setVendor(response.data);

            } catch (error) {

                console.log("VENDOR DETAILS ERROR:", error);

            }
        };

        loadVendor();

    }, [id]);


    if (!vendor) {

        return (
            <AdminLayout>

                <div className="admin-vendor-loading">
                    Loading vendor details...
                </div>

            </AdminLayout>
        );
    }


    return (

        <AdminLayout>

            <div className="admin-vendor-details-page">

                <div className="admin-vendor-details-header">

                    <div>

                        <h1>Vendor Details</h1>

                        <p>
                            Monitor vendor marketplace activity
                        </p>

                    </div>

                    <button
                        className="admin-back-button"
                        onClick={() =>
                            navigate("/admin/vendors")
                        }
                    >
                        Back to Vendors
                    </button>

                </div>


                {/* Vendor Overview */}

                <div className="vendor-details-card">

                    <div className="vendor-details-title">

                        <div>

                            <h2>
                                {vendor.name}
                            </h2>

                            <p>
                                Vendor ID: #{vendor.id}
                            </p>

                        </div>

                        <span className="vendor-status active">
                            ACTIVE
                        </span>

                    </div>


                    {/* Basic Vendor Information */}

                    <div className="vendor-information">

                        <div className="vendor-info-item">

                            <label>Vendor ID</label>

                            <p>
                                #{vendor.vendorId}
                            </p>

                        </div>


                        <div className="vendor-info-item">

                            <label>Vendor Name</label>

                            <p>
                                {vendor.vendorName}
                            </p>

                        </div>


                        <div className="vendor-info-item">

                            <label>Email</label>

                            <p>
                                {vendor.email}
                            </p>

                        </div>


                        <div className="vendor-info-item">

                            <label>Account Role</label>

                            <p>
                                {vendor.role}
                            </p>

                        </div>

                    </div>

                </div>


                {/* Marketplace Statistics */}

                <div className="vendor-statistics">

                    <div className="vendor-stat-card">

                        <h3>Total Products</h3>

                        <p>
                            {vendor.totalProducts}
                        </p>

                    </div>


                    <div className="vendor-stat-card">

                        <h3>Active Products</h3>

                        <p>
                            {vendor.activeProducts}
                        </p>

                    </div>


                    <div className="vendor-stat-card">

                        <h3>Total Orders</h3>

                        <p>
                            {vendor.totalOrders}
                        </p>

                    </div>


                    <div className="vendor-stat-card">

                        <h3>Total Sales</h3>

                        <p>
                            ₹{vendor.totalSales}
                        </p>

                    </div>

                </div>


                {/* Vendor Activity */}

                <div className="vendor-details-card">

                    <h2>Vendor Activity</h2>

                    <p className="vendor-section-description">
                        Marketplace activity and performance information
                        for this vendor will be displayed here.
                    </p>

                </div>

            </div>

        </AdminLayout>
    );
}

export default AdminVendorDetails;