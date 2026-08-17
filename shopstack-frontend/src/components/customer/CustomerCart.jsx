import { useEffect, useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
import { useNavigate } from "react-router-dom";
import "./Customer.css";

function CustomerCart() {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {

        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        setCartItems(savedCart);
    };


    const updateCart = (updatedCart) => {

        setCartItems(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );
    };


    const increaseQuantity = (id) => {

        const updatedCart = cartItems.map((item) => {

            if (item.id === id) {

                return {
                    ...item,
                    cartQuantity:
                        item.cartQuantity + 1
                };
            }

            return item;
        });

        updateCart(updatedCart);
    };


    const decreaseQuantity = (id) => {

        const updatedCart = cartItems
            .map((item) => {

                if (item.id === id) {

                    return {
                        ...item,
                        cartQuantity:
                            item.cartQuantity - 1
                    };
                }

                return item;
            })
            .filter(
                item => item.cartQuantity > 0
            );

        updateCart(updatedCart);
    };


    const removeItem = (id) => {

        const updatedCart =
            cartItems.filter(
                item => item.id !== id
            );

        updateCart(updatedCart);
    };


    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            item.cartQuantity,
        0
    );


    const deliveryCharge =
        subtotal >= 1000 || subtotal === 0
            ? 0
            : 50;


    const discount = 0;


    const total =
        subtotal +
        deliveryCharge -
        discount;


    return (
        <>
            <CustomerNavbar />

            <div className="customer-cart-page">

                {/* HEADER */}

                <div className="customer-cart-header">

                    <div>

                        <h1>
                            Your Shopping Cart
                        </h1>

                        <p>
                            Review your items before checkout
                        </p>

                    </div>

                    <span>
                        {cartItems.length} items
                    </span>

                </div>


                {cartItems.length === 0 ? (

                    /* EMPTY CART */

                    <div className="customer-empty-cart">

                        <div className="empty-cart-icon">
                            🛒
                        </div>

                        <h2>
                            Your cart is empty
                        </h2>

                        <p>
                            Add products to your cart to continue shopping.
                        </p>

                    </div>

                ) : (

                    /* CART CONTENT */

                    <div className="customer-cart-layout">


                        {/* CART ITEMS */}

                        <div className="customer-cart-items">

                            {cartItems.map((item) => (

                                <div
                                    className="customer-cart-item"
                                    key={item.id}
                                >

                                    {/* IMAGE */}

                                    <div className="cart-item-image">

                                        <img
                                            src={item.imageUrl}
                                            alt={item.productName}
                                        />

                                    </div>


                                    {/* PRODUCT DETAILS */}

                                    <div className="cart-item-details">

                                        <h3>
                                            {item.productName}
                                        </h3>

                                        <p>
                                            {item.brand}
                                        </p>

                                        <span>
                                            {item.category}
                                        </span>


                                        <button
                                            className="cart-remove-btn"
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>


                                    {/* PRICE */}

                                    <div className="cart-item-price">

                                        <span>
                                            ₹{item.price}
                                        </span>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="cart-quantity">

                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item.id)
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.cartQuantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                increaseQuantity(item.id)
                                            }
                                        >
                                            +
                                        </button>

                                    </div>


                                    {/* TOTAL */}

                                    <div className="cart-item-total">

                                        ₹
                                        {Number(item.price) *
                                            item.cartQuantity}

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* ORDER SUMMARY */}

                        <aside className="customer-order-summary">

                            <h2>
                                Order Summary
                            </h2>


                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹{subtotal}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    {deliveryCharge === 0
                                        ? "FREE"
                                        : `₹${deliveryCharge}`}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Discount
                                </span>

                                <strong>
                                    ₹{discount}
                                </strong>

                            </div>


                            <div className="summary-divider"></div>


                            <div className="summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{total}
                                </strong>

                            </div>


                            {/* CHECKOUT BUTTON */}

                            <button
                                className="checkout-btn"
                                onClick={() =>
                                    navigate("/customer/checkout")
                                }
                            >
                                Proceed to Checkout
                            </button>


                            <p className="free-delivery-text">

                                {subtotal >= 1000
                                    ? "Free delivery applied"
                                    : "Free delivery on orders above ₹1,000"}

                            </p>

                        </aside>

                    </div>

                )}

            </div>
        </>
    );
}

export default CustomerCart;