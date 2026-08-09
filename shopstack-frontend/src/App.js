import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import RoleSelection from "./Pages/RoleSelection";
import VendorLogin from "./Pages/VendorLogin";
import VendorRegister from "./Pages/VendorRegister";
import Profile from "./Pages/Profile";
import VendorDashboard from "./Pages/Vendor/VendorDashboard";
import AddProduct from "./Pages/Vendor/AddProduct";
import VendorProductList from "./Pages/Vendor/VendorProductList";

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route 
            path="/vendor/register" 
            element={<VendorRegister />} 
        />
        <Route path="/" element={<RoleSelection />} />
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/add-product" element={<AddProduct />} />
        <Route 
        path="/vendor/products" 
        element={<VendorProductList />} 
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;