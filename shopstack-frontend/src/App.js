import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import RoleSelection from "./Pages/RoleSelection";
import VendorLogin from "./Pages/VendorLogin";
import VendorRegister from "./Pages/VendorRegister";

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
      </Routes>

    </BrowserRouter>
  );
}

export default App;