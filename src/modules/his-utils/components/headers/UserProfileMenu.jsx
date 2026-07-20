import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { decryptData } from "../../../../utils/SecurityConfig";
import "./UserProfileMenu.css";

const UserProfileMenu = () => {

    const [profileOpen, setProfileOpen] = useState(false);
    const sessionData = localStorage.getItem("data");
    const userData = sessionData ? decryptData(sessionData) : "";

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        // navigate("/dvdms/");
        window.location.href = "/dvdms/";
    };

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


    return (
        <div className="profile-container">
            <button
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
            >
                {/* <i className="fa fa-chevron-down"></i> */}
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            {profileOpen &&
                <div className="profile-dropdown">
                    {/* <div className="profile-dropdown-header">
                       
                        <div className="profile-avatar-large">
                            {userData?.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="profile-user-info">
                            <div className="profile-name">
                                {userData?.username}
                            </div>
                        </div>
                    </div> */}

                    <div className="profile-divider bg-info"></div>
                    <Link
                        to="#"
                        className="profile-menu-item"
                        onClick={() => {
                            window.location.href = "/dvdms/user-dashboard";
                        }}
                    >
                        <i className="fa fa-home"></i>
                        <span>Go To Home</span>
                    </Link>

                    <div className="profile-divider"></div>
                    <button
                        className="profile-menu-item logout-btn"
                        onClick={logout}
                    >
                        <i className="fa fa-right-from-bracket"></i>
                        <span>Logout</span>
                    </button>
                </div>
            }
        </div>
    );
};

export default UserProfileMenu;