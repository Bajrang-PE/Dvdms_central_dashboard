import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./modernHeader.css";
import { decryptData } from "../../utils/SecurityConfig";
import SideNavigation from "./SideNavigation";
import UserProfileMenu from "./UserProfileMenu";
import StateDrawer from "./StateDrawer";

const ModernDashHeader = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [stateDrawerOpen, setStateDrawerOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const sessionData = localStorage.getItem("data");
    const userData = sessionData ? decryptData(sessionData) : "";

    useEffect(() => {
        const closeMenus = (e) => {
            if (!e.target.closest(".profile-container")) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("click", closeMenus);
        return () => {
            document.removeEventListener("click", closeMenus);
        };
    }, []);

    const logout = () => {
        localStorage.clear();
<<<<<<< HEAD
        sessionStorage.clear();
=======
>>>>>>> a0ccc2589b2a38a8d68afca32404412f466012ac
        Cookies.remove("csrfToken");
        navigate("/dvdms/");
    };

<<<<<<< HEAD
    const handleRefresh = () => {
        window.location.reload(false);
    };

=======
>>>>>>> a0ccc2589b2a38a8d68afca32404412f466012ac

    return (
        <>
            <header className="modern-header">
                <div className="header-left">
                    <button
                        className={`hamburger ${menuOpen ? "active" : ""}`}
                        onClick={() => setMenuOpen(true)}
<<<<<<< HEAD
                        title="View menus"
=======
>>>>>>> a0ccc2589b2a38a8d68afca32404412f466012ac
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <Link to="/dvdms/" className="brand-wrapper">
                        <div className="brand-title">
                            DVDMS CENTRAL DASHBOARD
                        </div>
                        <div className="brand-subtitle">
                            Ministry of Health and Family Welfare (Govt. of India)
                        </div>
                    </Link>
                </div>
                <div className="header-right">
                    <button
                        className="header-btn"
<<<<<<< HEAD
                        onClick={() => handleRefresh()}
                        title="Refresh Page"
                    >
                        <i className="fa fa-refresh"></i>
                    </button>

                    <button
                        className="header-btn"
                        onClick={() => navigate("/dvdms/user-dashboard")}
                        title="Go to home page"
=======
                        onClick={() => navigate("/dvdms/user-dashboard")}
>>>>>>> a0ccc2589b2a38a8d68afca32404412f466012ac
                    >
                        <i className="fa fa-home"></i>
                    </button>
                    <button
                        className="header-btn"
                        onClick={() => setStateDrawerOpen(true)}
<<<<<<< HEAD
                        title="View state dvdms links"
=======
>>>>>>> a0ccc2589b2a38a8d68afca32404412f466012ac
                    >
                        <i className="fa fa-link"></i>
                        <span>
                            State DVDMS
                        </span>
                    </button>
                    <div className="profile-container">
                        <button
                            className="profile-btn"
                            onClick={() => setProfileOpen(!profileOpen)}
<<<<<<< HEAD
                            title="User menu options"
=======
>>>>>>> a0ccc2589b2a38a8d68afca32404412f466012ac
                        >
                            <div className="avatar">
                                {userData?.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="profile-details">
                                <div className="username">
                                    {userData?.username}
                                </div>
                                {/* <div className="role">
                                    Administrator
                                </div> */}
                            </div>
                            <i className="fa fa-chevron-down"></i>
                        </button>
                        {
                            profileOpen &&
                            <UserProfileMenu
                                userData={userData}
                                logout={logout}
                            />
                        }
                    </div>
                </div>
            </header>
            <SideNavigation
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />
            <StateDrawer
                isOpen={stateDrawerOpen}
                onClose={() => setStateDrawerOpen(false)}
            />
        </>
    );
};
export default ModernDashHeader;
