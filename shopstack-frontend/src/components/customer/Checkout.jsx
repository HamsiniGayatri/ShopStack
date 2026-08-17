import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";
import api from "../../services/api";
import "./Checkout.css";

function Checkout() {

    const navigate = useNavigate();

    const cartItems =
        JSON.parse(localStorage.getItem("cart")) || [];

    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.cartQuantity),
        0
    );

    const delivery =
        subtotal >= 1000 || subtotal === 0
            ? 0
            : 50;

    const total = subtotal + delivery;

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"
    });

    const [loading, setLoading] = useState(false);


    // =====================================================
    // ADDRESS CHANGE
    // =====================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // =====================================================
    // OPEN RAZORPAY
    // =====================================================

    const openRazorpayCheckout = (
        razorpayOrder,
        shopstackOrderId,
        customerId
    ) => {

        const options = {

            key:
                process.env.REACT_APP_RAZORPAY_KEY_ID,

            amount:
                razorpayOrder.amount,

            currency:
                razorpayOrder.currency,

            name:
                "ShopStack",

            description:
                "ShopStack Order Payment",

            order_id:
                razorpayOrder.id,


            // =================================================
            // RAZORPAY PAYMENT SUCCESS
            // =================================================

            handler: async function (response) {

                console.log(
                    "================================="
                );

                console.log(
                    "RAZORPAY PAYMENT SUCCESS"
                );

                console.log(
                    "Response:",
                    response
                );

                console.log(
                    "Payment ID:",
                    response?.razorpay_payment_id
                );

                console.log(
                    "Razorpay Order ID:",
                    response?.razorpay_order_id
                );

                console.log(
                    "Signature:",
                    response?.razorpay_signature
                );

                console.log(
                    "================================="
                );


                try {

                    // =================================================
                    // STEP 1: VERIFY PAYMENT
                    // =================================================

                    const paymentResponse =
                        await api.post(
                            "/payments/verify",
                            {
                                shopstack_order_id:
                                    String(
                                        shopstackOrderId
                                    ),

                                customer_id:
                                    String(
                                        customerId
                                    ),

                                razorpay_order_id:
                                    response?.razorpay_order_id ||
                                    razorpayOrder.id,

                                razorpay_payment_id:
                                    response?.razorpay_payment_id ||
                                    "",

                                razorpay_signature:
                                    response?.razorpay_signature ||
                                    ""
                            }
                        );


                    console.log(
                        "Payment verified:",
                        paymentResponse.data
                    );


                    // =================================================
                    // STEP 2: UPDATE SHOPSTACK ORDER
                    // =================================================
                    //
                    // This calls:
                    //
                    // POST /orders/{id}/payment-success
                    //
                    // and triggers:
                    //
                    // paymentStatus = COMPLETED
                    // status = CONFIRMED
                    // stock reduction
                    // total calculation
                    //
                    // =================================================

                    const orderPaymentResponse =
                        await api.post(
                            `/orders/${shopstackOrderId}/payment-success`,
                            {
                                razorpay_payment_id:
                                    response?.razorpay_payment_id ||
                                    "",

                                razorpay_order_id:
                                    response?.razorpay_order_id ||
                                    razorpayOrder.id
                            }
                        );


                    console.log(
                        "ShopStack order payment updated:",
                        orderPaymentResponse.data
                    );


                    // =================================================
                    // IMPORTANT DEBUG
                    // =================================================

                    console.log(
                        "================================="
                    );

                    console.log(
                        "UPDATED SHOPSTACK ORDER"
                    );

                    console.log(
                        "Order ID:",
                        orderPaymentResponse.data?.id
                    );

                    console.log(
                        "Order Status:",
                        orderPaymentResponse.data?.status
                    );

                    console.log(
                        "Payment Status:",
                        orderPaymentResponse.data?.paymentStatus
                    );

                    console.log(
                        "Total Amount:",
                        orderPaymentResponse.data?.totalAmount
                    );

                    console.log(
                        "================================="
                    );


                    // =================================================
                    // CLEAR CART
                    // =================================================

                    localStorage.removeItem(
                        "cart"
                    );


                    // =================================================
                    // STOP LOADING
                    // =================================================

                    setLoading(false);


                    // =================================================
                    // GO TO ORDER DETAILS
                    // =================================================

                    navigate(
                        `/customer/orders/${shopstackOrderId}`
                    );

                } catch (error) {

                    console.error(
                        "Payment verification/order update error:",
                        error
                    );

                    console.error(
                        "Backend response:",
                        error.response?.data
                    );


                    setLoading(false);


                    alert(
                        error.response?.data ||
                        "Payment verification failed."
                    );


                    // =================================================
                    // STILL GO TO ORDER DETAILS
                    // =================================================

                    navigate(
                        `/customer/orders/${shopstackOrderId}`
                    );
                }
            },


            // =================================================
            // PAYMENT MODAL DISMISSED
            // =================================================

            modal: {

                ondismiss: function () {

                    setLoading(false);
                }
            },


            // =================================================
            // RAZORPAY THEME
            // =================================================

            theme: {

                color: "#3399cc"
            }
        };


        const razorpay =
            new window.Razorpay(
                options
            );


        // =====================================================
        // PAYMENT FAILED
        // =====================================================

        razorpay.on(
            "payment.failed",
            async function (response) {

                console.error(
                    "RAZORPAY PAYMENT FAILED",
                    response
                );


                try {

                    await api.post(
                        `/orders/${shopstackOrderId}/payment-failed`
                    );

                } catch (error) {

                    console.error(
                        "Unable to update failed payment:",
                        error
                    );
                }


                setLoading(false);


                alert(
                    response.error?.description ||
                    "Payment failed."
                );


                navigate(
                    `/customer/orders/${shopstackOrderId}`
                );
            }
        );


        razorpay.open();
    };


    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder = async (e) => {

        e.preventDefault();


        const customerId =
            localStorage.getItem("userId");


        if (!customerId) {

            navigate("/login");

            return;
        }


        if (cartItems.length === 0) {

            alert(
                "Your cart is empty."
            );

            navigate(
                "/customer/cart"
            );

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // STEP 1: CREATE SHOPSTACK ORDER
            // =================================================

            const orderData = {

                customerId:
                    Number(customerId),

                totalAmount:
                    total,

                address:
                    formData.address,

                city:
                    formData.city,

                state:
                    formData.state,

                pincode:
                    formData.pincode,

                country:
                    formData.country,

                status:
                    "PENDING",

                paymentStatus:
                    "PENDING",

                paymentMethod:
                    "RAZORPAY",

                items:
                    cartItems.map((item) => ({

                        product: {

                            id:
                                Number(item.id)
                        },

                        quantity:
                            Number(
                                item.cartQuantity
                            )
                    }))
            };


            console.log(
                "================================="
            );

            console.log(
                "CREATING SHOPSTACK ORDER"
            );

            console.log(
                "Order Data:",
                orderData
            );

            console.log(
                "================================="
            );


            const orderResponse =
                await api.post(
                    "/orders",
                    orderData
                );


            const shopstackOrderId =
                orderResponse.data.id;


            console.log(
                "ShopStack Order ID:",
                shopstackOrderId
            );

            console.log(
                "Created Order:",
                orderResponse.data
            );


            // =================================================
            // STEP 2: CREATE RAZORPAY ORDER
            // =================================================

            const razorpayResponse =
                await api.post(
                    "/payments/create-order",
                    null,
                    {
                        params: {
                            orderId:
                                shopstackOrderId
                        }
                    }
                );


            const razorpayOrder =
                razorpayResponse.data;


            console.log(
                "Razorpay Order:",
                razorpayOrder
            );


            // =================================================
            // STEP 3: LOAD RAZORPAY
            // =================================================

            if (!window.Razorpay) {

                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    "https://checkout.razorpay.com/v1/checkout.js";


                script.onload = () => {

                    openRazorpayCheckout(
                        razorpayOrder,
                        shopstackOrderId,
                        customerId
                    );
                };


                script.onerror = () => {

                    setLoading(false);

                    alert(
                        "Unable to load Razorpay Checkout."
                    );
                };


                document.body.appendChild(
                    script
                );

            } else {

                openRazorpayCheckout(
                    razorpayOrder,
                    shopstackOrderId,
                    customerId
                );
            }

        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );


            alert(
                error.response?.data ||
                "Unable to start payment."
            );


            setLoading(false);
        }
    };


    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            <CustomerNavbar />


            <div className="checkout-page">

                <div className="checkout-container">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="checkout-header">

                        <h1>
                            Checkout
                        </h1>

                        <p>
                            Complete your order securely
                        </p>

                    </div>


                    <div className="checkout-content">


                        {/* =================================================
                            ADDRESS + PAYMENT FORM
                        ================================================= */}

                        <form
                            className="checkout-form"
                            onSubmit={
                                handlePlaceOrder
                            }
                        >


                            {/* =================================================
                                DELIVERY ADDRESS
                            ================================================= */}

                            <div className="checkout-card">

                                <h2>
                                    Delivery Address
                                </h2>


                                <textarea
                                    name="address"
                                    placeholder="Complete Address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />


                                <div className="checkout-input-row">

                                    <input
                                        name="city"
                                        placeholder="City"
                                        value={
                                            formData.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />


                                    <input
                                        name="state"
                                        placeholder="State"
                                        value={
                                            formData.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="checkout-input-row">

                                    <input
                                        name="pincode"
                                        placeholder="Pincode"
                                        value={
                                            formData.pincode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />


                                    <input
                                        name="country"
                                        placeholder="Country"
                                        value={
                                            formData.country
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                PAYMENT
                            ================================================= */}

                            <div className="checkout-card">

                                <h2>
                                    Payment Method
                                </h2>


                                <label className="payment-option">

                                    <input
                                        type="radio"
                                        checked={true}
                                        readOnly
                                    />


                                    <div>

                                        <strong>
                                            Razorpay
                                        </strong>

                                        <p>
                                            Secure payment using
                                            Razorpay Test Mode
                                        </p>

                                    </div>

                                </label>

                            </div>


                            {/* =================================================
                                BUTTON
                            ================================================= */}

                            <button
                                type="submit"
                                className="place-order-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Opening Payment..."
                                    : `Pay ₹${total}`
                                }

                            </button>

                        </form>


                        {/* =================================================
                            ORDER SUMMARY
                        ================================================= */}

                        <div className="checkout-summary">

                            <h2>
                                Order Summary
                            </h2>


                            <div className="checkout-items">

                                {cartItems.map(
                                    (item) => (

                                        <div
                                            className="checkout-item"
                                            key={item.id}
                                        >

                                            <img
                                                src={
                                                    item.imageUrl
                                                }
                                                alt={
                                                    item.productName
                                                }
                                            />


                                            <div>

                                                <strong>
                                                    {
                                                        item.productName
                                                    }
                                                </strong>

                                                <p>
                                                    Qty:
                                                    {" "}
                                                    {
                                                        item.cartQuantity
                                                    }
                                                </p>

                                            </div>


                                            <strong>
                                                ₹
                                                {
                                                    Number(
                                                        item.price
                                                    ) *
                                                    Number(
                                                        item.cartQuantity
                                                    )
                                                }
                                            </strong>

                                        </div>
                                    )
                                )}

                            </div>


                            <div className="checkout-divider" />


                            <div className="checkout-summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹{subtotal}
                                </strong>

                            </div>


                            <div className="checkout-summary-row">

                                <span>
                                    Delivery
                                </span>

                                <strong>

                                    {delivery === 0
                                        ? "FREE"
                                        : `₹${delivery}`
                                    }

                                </strong>

                            </div>


                            <div className="checkout-divider" />


                            <div className="checkout-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{total}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Checkout;