import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../../Auth";
import Loader from "./component/Loader";

const DvdmsDashboard = lazy(() => import("./pages/DvdmsDashboard"));
const ChangeUserDetails = lazy(() => import("./pages/ChangeUserDetails"));
const ChangeDvdmsPass = lazy(() => import("./pages/ChangeDvdmsPass"));
const Menus = lazy(() => import("./pages/Menus"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

const LoginWarRoutes = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/user-dashboard" element={<Auth comp={DvdmsDashboard} />} />
                <Route path="/change-password" element={<Auth comp={ChangeDvdmsPass} />} />
                <Route path="/change-user" element={<Auth comp={ChangeUserDetails} />} />
                <Route path="/menus/*" element={<Auth comp={Menus} />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default LoginWarRoutes;