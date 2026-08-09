import { useEffect, useState } from "react";
import "./VendorProductList.css";
import VendorNavbar from "../../components/VendorNavbar";
import api from "../../services/api";

function VendorProductList() {

    const [products, setProducts] = useState([]);


    useEffect(() => {

    const vendorId = localStorage.getItem("userId");

        api.get(`/products/vendor/${vendorId}`)
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);


    const fetchProducts = async () => {

        try {

            const vendorId = Number(
                localStorage.getItem("userId")
            );

            const response = await api.get(
                `/products/vendor/${vendorId}`
            );

            setProducts(response.data);

        } catch(error) {

            console.log(error);

        }

    };

    const deleteProduct = async (id) => {

        try {

            await api.delete(`/products/${id}`);

            alert("Product deleted");

            fetchProducts();

        } catch(error) {

            console.log(error);

        }

    };


    return (

        <>

        <VendorNavbar />

        <div className="product-list-container">

            <h1></h1>


            <div className="product-grid">

            {
                products.map((product)=>(

                    <div className="product-card" key={product.id}>


                        <img
                            src={product.imageUrl}
                            alt={product.productName}
                        />


                        <h3>
                            {product.productName}
                        </h3>


                        <p>
                            Brand: {product.brand}
                        </p>


                        <p>
                            Price: ₹{product.price}
                        </p>


                        <p>
                            Stock: {product.stockQuantity}
                        </p>


                        <p>
                            Status: {product.status}
                        </p>


                        <button
                            onClick={()=>deleteProduct(product.id)}
                        >
                            Delete
                        </button>


                    </div>

                ))
            }

            </div>

        </div>

        </>

    );

}

export default VendorProductList;