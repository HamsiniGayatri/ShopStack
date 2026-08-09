import { useState } from "react";
import "./AddProduct.css";
import VendorNavbar from "../../components/VendorNavbar";
import api from "../../services/api";

function AddProduct() {

    const [product, setProduct] = useState({
        productName: "",
        category: "",
        brand: "",
        description: "",
        price: "",
        stockQuantity: ""
    });

    const [image, setImage] = useState(null);


    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };


    const uploadImage = async () => {

        const formData = new FormData();

        formData.append("file", image);


        const response = await api.post(
            "/images/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );


        return response.data;

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            let uploadedImageUrl = "";


            if(image){
                uploadedImageUrl = await uploadImage();
            }


            const vendorId = localStorage.getItem("userId");


            const productData = {

                ...product,

                price:Number(product.price),

                stockQuantity:Number(product.stockQuantity),

                imageUrl:uploadedImageUrl,

                vendor:{
                    id:Number(vendorId)
                }

            };


            await api.post(
                "/products/add",
                productData
            );


            alert("Product Submitted Successfully");


            setProduct({

                productName: "",
                category: "",
                brand: "",
                description: "",
                price: "",
                stockQuantity: ""

            });


            setImage(null);


        } catch(error) {

            console.log(error);

            alert("Unable to submit product");

        }

    };


    return (

        <>

            <VendorNavbar />


            <div className="add-product-container">


                <h1>Add New Product</h1>


                <form onSubmit={handleSubmit}>


                    <input
                        type="text"
                        name="productName"
                        placeholder="Product Name"
                        value={product.productName}
                        onChange={handleChange}
                    />


                    <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        value={product.brand}
                        onChange={handleChange}
                    />


                    <select

                        name="category"

                        value={product.category}

                        onChange={handleChange}

                    >

                        <option value="">
                            Select Category
                        </option>

                        <option>
                            Electronics
                        </option>

                        <option>
                            Furniture
                        </option>

                        <option>
                            Fashion
                        </option>

                        <option>
                            Books
                        </option>

                        <option>
                            Sports
                        </option>

                        <option>
                            Groceries
                        </option>


                    </select>



                    <textarea

                        name="description"

                        placeholder="Description"

                        value={product.description}

                        onChange={handleChange}

                    />



                    <input

                        type="number"

                        name="price"

                        placeholder="Price"

                        value={product.price}

                        onChange={handleChange}

                    />



                    <input

                        type="number"

                        name="stockQuantity"

                        placeholder="Stock Quantity"

                        value={product.stockQuantity}

                        onChange={handleChange}

                    />



                    <input

                        type="file"

                        accept="image/*"

                        onChange={(e)=>setImage(e.target.files[0])}

                    />



                    <button type="submit">

                        Submit Product

                    </button>


                </form>


            </div>

        </>

    );

}


export default AddProduct;