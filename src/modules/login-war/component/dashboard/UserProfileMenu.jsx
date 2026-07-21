import React from "react";
import { Link } from "react-router-dom";

const UserProfileMenu = ({ userData, logout }) => {
    return (
        <div className="profile-dropdown">
            <div className="profile-dropdown-header">
                <div className="profile-avatar-large">
                    {userData?.username?.charAt(0)?.toUpperCase()}
                </div>

                <div className="profile-user-info">
                    <div className="profile-name">
                        {userData?.username}
                    </div>

                    <div className="profile-role">
                        Administrator
                    </div>
                </div>
            </div>

            <div className="profile-divider bg-info"></div>

            <Link
                to="/dvdms/change-password"
                className="profile-menu-item"
            >
                <i className="fa fa-lock"></i>
                <span>Change Password</span>
            </Link>

            <Link
                to="/dvdms/change-user"
                className="profile-menu-item"
            >
                <i className="fa fa-user-pen"></i>
                <span>Edit Profile</span>
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
    );
};

export default UserProfileMenu;