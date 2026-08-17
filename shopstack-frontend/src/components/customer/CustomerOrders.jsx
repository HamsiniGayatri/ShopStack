import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";
import api from "../../services/api";
import "./CustomerOrders.css";

function CustomerOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [actionLoading, setActionLoading] = useState(null);


    // =========================================================
    // FETCH ORDERS
    // =========================================================

    useEffect(() => {

        fetchOrders();

    }, []);


    const fetchOrders = async () => {

    try {

        const customerId = localStorage.getItem("userId");

        if (!customerId) {

            navigate("/login");
            return;

        }

        const response = await api.get(
            `/orders/customer/${customerId}`
        );

        console.log("Orders Response:", response.data);
        console.log("Is Array:", Array.isArray(response.data));

        if (Array.isArray(response.data)) {

            setOrders(response.data);

        } else if (Array.isArray(response.data.orders)) {

            // If backend returns { orders:[...] }
            setOrders(response.data.orders);

        } else if (Array.isArray(response.data.content)) {

            // If backend returns Page<Order>
            setOrders(response.data.content);

        } else {

            console.warn(
                "Backend did not return an array:",
                response.data
            );

            setOrders([]);

        }

    } catch (error) {

        console.error("Error fetching orders:", error);

        setOrders([]);

    } finally {

        setLoading(false);

    }

};


    // =========================================================
    // FILTER ORDERS
    // =========================================================

    const filteredOrders = useMemo(() => {

        return orders.filter(order => {

            const searchText =
                search.toLowerCase();

            const matchesSearch =
                String(order.id)
                    .toLowerCase()
                    .includes(searchText) ||

                String(order.city || "")
                    .toLowerCase()
                    .includes(searchText) ||

                String(order.status || "")
                    .toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                order.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [orders, search, statusFilter]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalOrders =
        orders.length;

    const activeOrders =
        orders.filter(order =>
            [
                "PENDING",
                "CONFIRMED",
                "PROCESSING",
                "SHIPPED"
            ].includes(order.status)
        ).length;

    const deliveredOrders =
        orders.filter(
            order =>
                order.status === "DELIVERED"
        ).length;

    const cancelledOrders =
        orders.filter(
            order =>
                order.status === "CANCELLED"
        ).length;


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = status => {

        return String(status || "PENDING")
            .toLowerCase();
    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = date => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = date => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // =========================================================
    // CANCEL ORDER
    // =========================================================

    const cancelOrder = async orderId => {

        const customerId =
            localStorage.getItem("userId");

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(orderId);

            await api.put(
                `/orders/${orderId}/cancel`,
                null,
                {
                    params: {
                        customerId
                    }
                }
            );

            await fetchOrders();

            alert(
                "Order cancelled successfully."
            );

        } catch (error) {

            console.error(
                "Cancel order error:",
                error
            );

            alert(
                error.response?.data ||
                "Unable to cancel order."
            );

        } finally {

            setActionLoading(null);
        }
    };


    // =========================================================
    // RETURN ORDER
    // =========================================================

    const returnOrder = async orderId => {

        const customerId =
            localStorage.getItem("userId");

        const confirmed =
            window.confirm(
                "Are you sure you want to return this order?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(orderId);

            await api.put(
                `/orders/${orderId}/return`,
                null,
                {
                    params: {
                        customerId
                    }
                }
            );

            await fetchOrders();

            alert(
                "Return request submitted successfully."
            );

        } catch (error) {

            console.error(
                "Return order error:",
                error
            );

            alert(
                error.response?.data ||
                "Unable to return order."
            );

        } finally {

            setActionLoading(null);
        }
    };


    // =========================================================
    // TRACKING
    // =========================================================

    const trackingSteps = [
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED"
    ];


    const getTrackingIndex = status => {

        const index =
            trackingSteps.indexOf(status);

        return index >= 0 ? index : 0;
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <>
                <CustomerNavbar />

                <div className="orders-loading">

                    <div className="loading-box">

                        <div className="loading-spinner"></div>

                        <strong>
                            Loading your orders
                        </strong>

                        <span>
                            Please wait while we retrieve your order history.
                        </span>

                    </div>

                </div>
            </>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (
        <>
            <CustomerNavbar />

            <main className="customer-orders-page">

                <div className="orders-container">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <section className="orders-header">

                        <div>

                            <span className="section-label">
                                ACCOUNT / ORDERS
                            </span>

                            <h1>
                                My Orders
                            </h1>

                            <p>
                                Track purchases, payments and delivery
                                progress from one place.
                            </p>

                        </div>

                        <div className="orders-header-actions">

                            <button
                                className="continue-shopping-button"
                                onClick={() =>
                                    navigate("/customer/home")
                                }
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        METRICS
                    ================================================= */}

                    <section className="orders-metrics">

                        <div className="metric-card">

                            <div className="metric-icon">
                                ORD
                            </div>

                            <div>

                                <span>
                                    Total Orders
                                </span>

                                <strong>
                                    {totalOrders}
                                </strong>

                            </div>

                        </div>


                        <div className="metric-card">

                            <div className="metric-icon active">
                                ACT
                            </div>

                            <div>

                                <span>
                                    Active Orders
                                </span>

                                <strong>
                                    {activeOrders}
                                </strong>

                            </div>

                        </div>


                        <div className="metric-card">

                            <div className="metric-icon delivered">
                                DEL
                            </div>

                            <div>

                                <span>
                                    Delivered
                                </span>

                                <strong>
                                    {deliveredOrders}
                                </strong>

                            </div>

                        </div>


                        <div className="metric-card">

                            <div className="metric-icon cancelled">
                                CAN
                            </div>

                            <div>

                                <span>
                                    Cancelled
                                </span>

                                <strong>
                                    {cancelledOrders}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        TOOLBAR
                    ================================================= */}

                    <section className="orders-toolbar">

                        <div className="orders-search">

                            <span className="search-icon">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search by order ID, city or status..."
                                value={search}
                                onChange={e =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        <div className="orders-filter">

                            <label>
                                STATUS
                            </label>

                            <select
                                value={statusFilter}
                                onChange={e =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Orders
                                </option>

                                <option value="PENDING">
                                    Pending
                                </option>

                                <option value="CONFIRMED">
                                    Confirmed
                                </option>

                                <option value="PROCESSING">
                                    Processing
                                </option>

                                <option value="SHIPPED">
                                    Shipped
                                </option>

                                <option value="DELIVERED">
                                    Delivered
                                </option>

                                <option value="CANCELLED">
                                    Cancelled
                                </option>

                                <option value="RETURNED">
                                    Returned
                                </option>

                                <option value="REFUNDED">
                                    Refunded
                                </option>

                            </select>

                        </div>


                        <div className="results-count">

                            Showing
                            {" "}
                            <strong>
                                {filteredOrders.length}
                            </strong>
                            {" "}
                            orders

                        </div>

                    </section>


                    {/* =================================================
                        ORDERS
                    ================================================= */}

                    {filteredOrders.length === 0 ? (

                        <section className="orders-empty">

                            <div className="empty-orders-icon">
                                ORD
                            </div>

                            <h2>
                                No orders found
                            </h2>

                            <p>
                                Your order history will appear here.
                            </p>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/customer/home")
                                }
                            >
                                Start Shopping
                            </button>

                        </section>

                    ) : (

                        <section className="orders-list">

                            {filteredOrders.map(order => {

                                const trackingIndex =
                                    getTrackingIndex(
                                        order.status
                                    );

                                const progress =
                                    (trackingIndex / 4) * 100;

                                return (

                                    <article
                                        className="order-card"
                                        key={order.id}
                                    >


                                        {/* =================================
                                            ORDER HEADER
                                        ================================= */}

                                        <div className="order-card-header">

                                            <div className="order-heading">

                                                <div className="order-id-row">

                                                    <span className="order-number">
                                                        Order #{order.id}
                                                    </span>

                                                    <span className="order-date">
                                                        {formatDate(
                                                            order.orderDate
                                                        )}
                                                        {" "}
                                                        {formatTime(
                                                            order.orderDate
                                                        )}
                                                    </span>

                                                </div>

                                                <p>
                                                    ShopStack Marketplace
                                                </p>

                                            </div>


                                            <div className="order-status-area">

                                                <span
                                                    className={
                                                        `order-status ${getStatusClass(
                                                            order.status
                                                        )}`
                                                    }
                                                >
                                                    {order.status}
                                                </span>

                                                <span className="payment-badge">

                                                    {order.paymentStatus ||
                                                        "PENDING"}

                                                </span>

                                            </div>

                                        </div>


                                        {/* =================================
                                            ORDER INFO
                                        ================================= */}

                                        <div className="order-info">


                                            <div>

                                                <span>
                                                    ORDER VALUE
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        order.totalAmount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    PAYMENT
                                                </span>

                                                <strong>
                                                    {order.paymentMethod ||
                                                        "Razorpay"}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    DELIVERY LOCATION
                                                </span>

                                                <strong>
                                                    {order.city || "—"},
                                                    {" "}
                                                    {order.state || ""}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    CUSTOMER
                                                </span>

                                                <strong>
                                                    #{order.customerId}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* =================================
                                            TRACKING
                                        ================================= */}

                                        {![
                                            "CANCELLED",
                                            "RETURNED",
                                            "REFUNDED"
                                        ].includes(order.status) && (

                                            <div
                                                className="tracking"
                                                style={{
                                                    "--tracking-progress":
                                                        `${progress}%`
                                                }}
                                            >

                                                {trackingSteps.map(
                                                    (step, index) => {

                                                        const active =
                                                            index <=
                                                            trackingIndex;

                                                        return (

                                                            <div
                                                                className={
                                                                    `tracking-step ${
                                                                        active
                                                                            ? "active"
                                                                            : ""
                                                                    }`
                                                                }
                                                                key={step}
                                                            >

                                                                <div className="tracking-circle">

                                                                    {active
                                                                        ? "✓"
                                                                        : index + 1}

                                                                </div>

                                                                <span>
                                                                    {step}
                                                                </span>

                                                            </div>

                                                        );

                                                    }
                                                )}

                                            </div>

                                        )}


                                        {/* =================================
                                            DELIVERY INFORMATION
                                        ================================= */}

                                        <div className="order-delivery-panel">

                                            <div className="delivery-block">

                                                <span className="panel-label">
                                                    DELIVERY ADDRESS
                                                </span>

                                                <strong>
                                                    {order.address}
                                                </strong>

                                                <p>
                                                    {order.city},
                                                    {" "}
                                                    {order.state}
                                                    {" "}
                                                    {order.pincode}
                                                </p>

                                            </div>


                                            <div className="delivery-divider"></div>


                                            <div className="delivery-block">

                                                <span className="panel-label">
                                                    PAYMENT STATUS
                                                </span>

                                                <strong>
                                                    {order.paymentStatus ||
                                                        "PENDING"}
                                                </strong>

                                                <p>
                                                    {order.paymentMethod ||
                                                        "Razorpay"}
                                                </p>

                                            </div>


                                            <div className="delivery-divider"></div>


                                            <div className="delivery-block">

                                                <span className="panel-label">
                                                    ORDER TOTAL
                                                </span>

                                                <strong className="amount-value">
                                                    ₹
                                                    {Number(
                                                        order.totalAmount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                                <p>
                                                    Inclusive of delivery
                                                </p>

                                            </div>

                                        </div>


                                        {/* =================================
                                            ACTIONS
                                        ================================= */}

                                        <div className="order-actions">

                                            <button
                                                className="secondary-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/customer/orders/${order.id}`
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>


                                            {[
                                                "PENDING",
                                                "CONFIRMED",
                                                "PROCESSING"
                                            ].includes(
                                                order.status
                                            ) && (

                                                <button
                                                    className="danger-button"
                                                    disabled={
                                                        actionLoading ===
                                                        order.id
                                                    }
                                                    onClick={() =>
                                                        cancelOrder(
                                                            order.id
                                                        )
                                                    }
                                                >
                                                    {actionLoading ===
                                                    order.id
                                                        ? "Processing..."
                                                        : "Cancel Order"}
                                                </button>

                                            )}


                                            {order.status ===
                                                "DELIVERED" && (

                                                <button
                                                    className="secondary-button"
                                                    disabled={
                                                        actionLoading ===
                                                        order.id
                                                    }
                                                    onClick={() =>
                                                        returnOrder(
                                                            order.id
                                                        )
                                                    }
                                                >
                                                    {actionLoading ===
                                                    order.id
                                                        ? "Processing..."
                                                        : "Request Return"}
                                                </button>

                                            )}

                                        </div>

                                    </article>

                                );

                            })}

                        </section>

                    )}

                </div>

            </main>
        </>
    );
}

export default CustomerOrders;