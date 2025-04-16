import React, { useContext } from 'react';
import { Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Menu.css';
import { LoginContext } from '../../context/LoginContext';

const MenuList = (props) => {
    const { activeDropdown } = props;
    const { setSelectedOption, setOpenPage } = useContext(LoginContext);


    const menuData = [
        {
            title: 'Services',
            items: [
                { dataVal: 'state', menuName: 'State Job Details', icon: 'fa-desktop' },
                { dataVal: 'country', menuName: 'Get Nin Data', icon: 'fa-desktop' },
                { dataVal: 'district', menuName: 'Covid Drig Availability Status', icon: 'fa-desktop' },
            ],
        },
        {
            title: 'Admin',
            subMenuTypes: [
                {
                    title: 'Admin Master',
                    items: [
                        { dataVal: 'addUser', menuName: 'Dashboard Setup', icon: 'fa-gear',link: "/dvdms/HIS_dashboard" },
                        { dataVal: 'editUser', menuName: 'Zone Master', icon: 'fa-gear', link: "/dvdms/menus/zone-master" },
                        { dataVal: 'editUser', menuName: 'State Master', icon: 'fa-gear', link: "/dvdms/menus/state-master" },
                        { dataVal: 'editUser', menuName: 'District Master', icon: 'fa-gear' },
                        { dataVal: 'editUser', menuName: 'State Config Cwh', icon: 'fa-gear', link: "/dvdms/menus/state-config-cwh" },
                        { dataVal: 'editUser', menuName: 'Facility Type Master', icon: 'fa-gear', link: "/dvdms/menus/facility-type-master" },
                        { dataVal: 'editUser', menuName: 'Group Master', icon: 'fa-gear' },
                        { dataVal: 'editUser', menuName: 'Sub Group Master', icon: 'fa-gear' },
                        { dataVal: 'editUser', menuName: 'Drug Type Master', icon: 'fa-gear', link: "/dvdms/menus/drug-type-master" },
                        { dataVal: 'editUser', menuName: 'Supplier Master', icon: 'fa-gear', link: "/dvdms/menus/supplier-master" },
                        { dataVal: 'editUser', menuName: 'Supplier Mapping Master', icon: 'fa-gear', link: "/dvdms/menus/supplier-mapping-master" },
                        { dataVal: 'editUser', menuName: 'Drug Type Master', icon: 'fa-gear' },

                        { dataVal: 'editUser', menuName: 'Generic Drug Master', icon: 'fa-gear', link: "/dvdms/menus/generic-drug-master" },
                        { dataVal: 'editUser', menuName: 'Facility Type Mapping Master', icon: 'fa-gear', link: "/dvdms/menus/facility-type-mapping-master" },
                        { dataVal: 'editUser', menuName: 'Job Order', icon: 'fa-gear' ,link: "/dvdms/menus/job-order-status-master"},
                        { dataVal: 'editUser', menuName: 'State CDB Sync Master', icon: 'fa-gear' ,link: "/dvdms/menus/state-cdb-sync-master"},
                    ],
                },
                {
                    title: 'IPHS Admin',
                    items: [
                        { dataVal: 'addRole', menuName: 'Iphs Group Master', icon: 'fa-gear' },
                        { dataVal: 'editRole', menuName: 'Iphs Sub Group Master', icon: 'fa-gear' },
                        { dataVal: 'editRole', menuName: 'Iphs Medicine Master', icon: 'fa-gear' },
                        { dataVal: 'editRole', menuName: 'Iphs Molecule Drug Master', icon: 'fa-gear' },
                        { dataVal: 'editRole', menuName: 'Iphs Medicine Molecule Detail Mapping', icon: 'fa-gear' },
                        { dataVal: 'editRole', menuName: 'Iphs Drug Mapping Master', icon: 'fa-gear' },
                    ],
                },
            ],
        },
        {
            title: 'Reports',
            items: [
                { dataVal: 'contact', menuName: 'Dashboard', icon: 'fa-bar-chart' },
                { dataVal: 'help', menuName: 'Report Set', icon: 'fa-bar-chart' },
                { dataVal: 'help', menuName: 'Admin Dashboard (Uat Dashboard)', icon: 'fa-bar-chart' },
                { dataVal: 'help', menuName: 'Admin New', icon: 'fa-bar-chart' },
                { dataVal: 'help', menuName: 'Job Dashboard', icon: 'fa-bar-chart' },
                { dataVal: 'help', menuName: 'Stockout V 2.0', icon: 'fa-bar-chart' },
            ],
        },
    ];

    const onTabChange = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }

    return (
        <ul className={`dropdown-menu mega-menu ${activeDropdown === 'dropmenulinks' ? 'show' : ''}`} id='dropmenulinks' style={{ border: "1px solid #003366" }}>
            <div className='container p-0'>
                <Accordion defaultActiveKey="0" className="custom-accordion">
                    {menuData.map((menuType, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index} className="custom-accordion-item mb-2">
                            <Accordion.Header className="custom-header">
                                <h5 className="menu-title"><b>{menuType.title}</b></h5>
                            </Accordion.Header>
                            <Accordion.Body>
                                {menuType.subMenuTypes ? (
                                    <Accordion className="">
                                        {menuType.subMenuTypes.map((subMenuType, subIndex) => (
                                            <Accordion.Item
                                                eventKey={`${index}-${subIndex}`}
                                                key={subIndex}
                                                className="custom-accordion-item mb-1">
                                                <Accordion.Header className="custom-header">
                                                    <h5 className="menu-title"><b>{subMenuType.title}</b></h5>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <div className="row">
                                                        {subMenuType.items?.map((item, idx) => (
                                                            <div key={idx} className="col-lg-3 col-md-4 col-sm-4 col-xs-4 menu-item">
                                                                <Link className="acrmenu" data-val={item.dataVal} data-menuname={item.menuName} title={item.menuName} to={item?.link ? item?.link : '#'} onClick={onTabChange}>
                                                                    <div className="menu-content">
                                                                        <i className={`fa ${item.icon}`}></i>
                                                                        <span>{item.menuName}</span>
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
                                        {menuType.items?.map((item, idx) => (
                                            <div key={idx} className="col-lg-3 col-md-4 col-sm-4 col-xs-4 menu-item">
                                                <Link className="acrmenu" data-val={item.dataVal} data-menuname={item.menuName} title={item.menuName} to={item?.link ? item?.link : '#'}>
                                                    <div className="menu-content">
                                                        <i className={`fa ${item.icon}`}></i>
                                                        <span>{item.menuName}</span>
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
