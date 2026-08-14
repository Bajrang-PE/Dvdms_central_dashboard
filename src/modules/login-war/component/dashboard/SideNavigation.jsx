
import React, { useContext, useEffect, useMemo, useState } from "react";
import "./sideNavigation.css";
import { LoginContext } from "../../context/LoginContext";
import { fetchData } from "../../../../utils/ApiHooks";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import TreeMenu from "./TreeMenu";


const SideNavigation = ({ isOpen, onClose }) => {
    const {
        setSelectedOption,
        setOpenPage,
        setIsShowReport
    } = useContext(LoginContext);

    const [menuData, setMenuData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const transformMenuData = (apiData) => {
        const tree = [];
        apiData.forEach(item => {
            const parts = item?.varMenuName
                ?.split("#")
                ?.filter(Boolean);
            if (!parts?.length) return;
            let currentLevel = tree;
            parts.forEach((part, index) => {
                let existingNode =
                    currentLevel.find(
                        node => node.title === part
                    );
                if (!existingNode) {
                    existingNode = {
                        title: part,
                        icon:
                            item?.fontIconName ||
                            "fa-folder",
                        link:
                            index === parts.length - 1
                                ?
                                item?.varURL
                                :
                                null,
                        dataVal:
                            item?.varMenuId,
                        children: []
                    };
                    currentLevel.push(
                        existingNode
                    );
                }
                currentLevel =
                    existingNode.children;
            });
        });
        return tree;
    };


    const getMenus = async () => {
        try {
            setLoading(true);
            const data = await fetchData(
                `/api/v1/getMenuBySeatId/${getAuthUserData("userSeatId") || 10001}`
            );

            console.log('menudata', data)
            if (data?.status === 1) {

                const formatted =
                    transformMenuData(
                        data?.data
                    );
                setMenuData(
                    formatted
                );
            }
            else {
                setError(
                    "Unable to load menu"
                );
            }
        }
        catch (err) {
            console.log(err);
            setError(
                "Unable to load menu"
            );
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getMenus();
    }, []);


    const filterTree = (
        nodes,
        keyword
    ) => {
        return nodes
            .map(node => {
                const children =
                    filterTree(
                        node.children || [],
                        keyword
                    );
                const matched =
                    node.title
                        .toLowerCase()
                        .includes(
                            keyword
                                .toLowerCase()
                        );
                if (
                    matched ||
                    children.length
                ) {
                    return {
                        ...node,
                        children
                    };
                }
                return null;
            })
            .filter(Boolean);
    };


    const filteredMenus = useMemo(() => {
        if (!search)
            return menuData;
        return filterTree(menuData, search);
    }, [search, menuData]);


    const onTabChange = () => {
        setOpenPage("home");
        setSelectedOption([]);
        setIsShowReport(false);
        onClose();
        setSearch('');
    };


    return (
        <>
            <div
                className={
                    `menu-overlay ${isOpen
                        ?
                        "show"
                        :
                        ""
                    }`
                }
                onClick={
                    onClose
                }
            />

            <aside
                className={
                    `side-navigation ${isOpen
                        ?
                        "open"
                        :
                        ""
                    }`
                }
            >

                <div
                    className="side-header"
                >
                    <div
                        className="side-logo"
                    >
                        DVDMS MENUS
                    </div>
                    <button
                        className="close-btn"
                        onClick={
                            onClose
                        }
                    >
                        <i
                            className="fa fa-xmark"
                        />
                    </button>
                </div>
                <div
                    className="menu-search-wrapper"
                >
                    <i
                        className="fa fa-search"
                    />
                    <input
                        type="text"
                        placeholder="Search menu..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />
                </div>
                <div
                    className="menu-body"
                >
                    {
                        loading &&
                        <div
                            className="menu-loading"
                        >
                            Loading Menu...
                        </div>
                    }
                    {
                        error &&
                        <div
                            className="menu-error"
                        >
                            {error}
                        </div>
                    }
                    {
                        !loading &&
                        !error &&
                        <TreeMenu
                            menuData={
                                filteredMenus
                            }
                            onTabChange={
                                onTabChange
                            }
                            search={search}
                        />
                    }
                </div>
            </aside>
        </>
    );
};
export default SideNavigation;