import { Routes, Route } from "react-router-dom";
import './LoginWar.css'
import DvdmsDashboard from "./pages/DvdmsDashboard";
import ChangeUserDetails from "./pages/ChangeUserDetails";
import ChangeDvdmsPass from "./pages/ChangeDvdmsPass";
import Menus from "./pages/Menus";
import Auth from "../../Auth";
import NotFoundPage from "./pages/NotFound";

const LoginWarRoutes = () => {
    return (
        <Routes>
            <Route path="/user-dashboard" element={<Auth comp={DvdmsDashboard} />} />
            <Route path="/change-password" element={<Auth comp={ChangeDvdmsPass} />} />
            <Route path="/change-user" element={<Auth comp={ChangeUserDetails} />} />
            <Route path="/menus/*" element={<Auth comp={Menus} />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default LoginWarRoutes;