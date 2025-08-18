import React, { useContext, useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Menu.css';
import { LoginContext } from '../../context/LoginContext';
import { fetchData } from '../../../../utils/ApiHooks';

const MenuList = (props) => {
    const { activeDropdown } = props;
    const { setSelectedOption, setOpenPage } = useContext(LoginContext);
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to transform API data into the required menu structure
    const transformMenuData = (apiData) => {
        const menuStructure = {};

        apiData.forEach(menuItem => {
            const [root, category, subCategory] = menuItem?.varMenuName?.split('#');

            if (!root) return;

            // Initialize root if it doesn't exist
            if (!menuStructure[root]) {
                menuStructure[root] = {
                    title: root,
                    items: [],
                    subMenuTypes: []
                };
            }

            // If there's no category, it's a direct item under root
            if (!category) {
                menuStructure[root]?.items?.push({
                    menuName: root,
                    icon: menuItem?.fontIconName || 'fa-gear',
                    link: menuItem?.varURL || '#',
                    dataVal: menuItem?.varMenuId || 'default'
                });
                return;
            }

            // If there's no subCategory, it's an item under category
            if (!subCategory) {
                // Check if category exists as a subMenuType
                const existingCategory = menuStructure[root]?.subMenuTypes?.find(
                    sub => sub?.title === category
                );

                if (existingCategory) {
                    existingCategory?.items?.push({
                        menuName: category,
                        icon: menuItem?.fontIconName || 'fa-gear',
                        link: menuItem?.varURL || '#',
                        dataVal: menuItem?.varMenuId || 'default'
                    });
                } else {
                    // Check if category exists as a regular item (need to convert to subMenuType)
                    const existingItemIndex = menuStructure[root]?.items?.findIndex(
                        item => item?.menuName === category
                    );

                    if (existingItemIndex !== -1) {
                        // Convert item to subMenuType
                        const existingItem = menuStructure[root]?.items[existingItemIndex];
                        menuStructure[root]?.subMenuTypes?.push({
                            title: category,
                            items: [{
                                menuName: category,
                                icon: existingItem?.icon,
                                link: existingItem?.link,
                                dataVal: existingItem?.dataVal
                            }]
                        });
                        // Remove from items array
                        menuStructure[root]?.items?.splice(existingItemIndex, 1);
                    } else {
                        // Add as a new subMenuType with one item
                        menuStructure[root]?.subMenuTypes?.push({
                            title: category,
                            items: [{
                                menuName: category,
                                icon: menuItem?.fontIconName || 'fa-gear',
                                link: menuItem?.varURL || '#',
                                dataVal: menuItem?.varMenuId || 'default'
                            }]
                        });
                    }
                }
                return;
            }

            // If we have all three parts (root, category, subCategory)
            // Find or create the category subMenuType
            let categorySubMenu = menuStructure[root]?.subMenuTypes?.find(
                sub => sub?.title === category
            );

            if (!categorySubMenu) {
                categorySubMenu = {
                    title: category,
                    items: []
                };
                menuStructure[root]?.subMenuTypes?.push(categorySubMenu);
            }

            // Add the subCategory item
            categorySubMenu.items.push({
                menuName: subCategory,
                icon: menuItem?.fontIconName || 'fa-gear',
                link: menuItem?.varURL || '#',
                dataVal: menuItem?.varMenuId || 'default'
            });
        });

        // Convert the object to an array
        return Object.values(menuStructure);
    };

    const getAllMenusList = async () => {
        try {
            setLoading(true);
            const data = await fetchData("http://10.226.25.164:8025/api/v1/getMenuBySeatId/10001");
            if (data?.status === 1) {
                const formattedMenuData = transformMenuData(data?.data);
                setMenuData(formattedMenuData);
            } else {
                throw new Error("Invalid menu data format");
            }
        } catch (err) {
            console.error("Error fetching menu data:", err);
            setError(err.message || "Failed to load menu data");
            setMenuData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllMenusList();
    }, []);

    const onTabChange = () => {
        setOpenPage('home');
        setSelectedOption([]);
    };

    if (loading) {
        return (
            <div className={`dropdown-menu mega-menu ${activeDropdown === 'dropmenulinks' ? 'show' : ''}`}>
                <div className="text-center p-3">Loading menu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`dropdown-menu mega-menu ${activeDropdown === 'dropmenulinks' ? 'show' : ''}`}>
                <div className="text-center p-3 text-danger">{error}</div>
            </div>
        );
    }


    return (
        <ul className={`dropdown-menu mega-menu ${activeDropdown === 'dropmenulinks' ? 'show' : ''}`} id='dropmenulinks' style={{ border: "1px solid #003366" }}>
            <div className='container p-0'>
                <Accordion defaultActiveKey="0" className="custom-accordion">
                    {menuData?.map((menuType, index) => (
                        <Accordion.Item eventKey={index?.toString()} key={index} className="custom-accordion-item mb-2">
                            <Accordion.Header className="custom-header">
                                <h5 className="menu-title"><b>{menuType?.title}</b></h5>
                            </Accordion.Header>
                            <Accordion.Body>
                                {menuType?.subMenuTypes && menuType?.subMenuTypes?.length > 0 ? (
                                    <Accordion className="">
                                        {menuType?.subMenuTypes?.map((subMenuType, subIndex) => (
                                            <Accordion.Item
                                                eventKey={`${index}-${subIndex}`}
                                                key={subIndex}
                                                className="custom-accordion-item mb-1">
                                                <Accordion.Header className="custom-header">
                                                    <h5 className="menu-title"><b>{subMenuType?.title}</b></h5>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <div className="row">
                                                        {subMenuType?.items?.map((item, idx) => (
                                                            <div key={idx} className="col-lg-3 col-md-4 col-sm-4 col-xs-4 menu-item">
                                                                <Link
                                                                    className="acrmenu"
                                                                    data-val={item?.dataVal}
                                                                    data-menuname={item?.menuName}
                                                                    title={item?.menuName}
                                                                    to={item?.link || '#'}
                                                                    onClick={onTabChange}
                                                                >
                                                                    <div className="menu-content">
                                                                        <i className={`fa ${item?.icon}`}></i>
                                                                        <span>{item?.menuName}</span>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="row">
                                        {menuType?.items?.map((item, idx) => (
                                            <div key={idx} className="col-lg-3 col-md-4 col-sm-4 col-xs-4 menu-item">
                                                <Link
                                                    className="acrmenu"
                                                    data-val={item?.dataVal}
                                                    data-menuname={item?.menuName}
                                                    title={item?.menuName}
                                                    to={item?.link || '#'}
                                                    onClick={onTabChange}
                                                >
                                                    <div className="menu-content">
                                                        <i className={`fa ${item?.icon}`}></i>
                                                        <span>{item?.menuName}</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>
        </ul>
    );
};

export default MenuList;