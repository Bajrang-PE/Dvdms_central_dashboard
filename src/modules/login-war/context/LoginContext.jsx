


import { createContext, useState } from "react";
import { fetchData, fetchPostData } from "../../../utils/ApiHooks";

export const LoginContext = createContext();

const LoginContextApi = ({ children }) => {

    //Globals
    const [showCmsLogin, setShowCmsLogin] = useState(false);
    const [showForgotPass, setShowForgotPass] = useState(false);
    const [selectedOption, setSelectedOption] = useState([]);
    const [openPage, setOpenPage] = useState('home')
    const [isShowReport, setIsShowReport] = useState(false)

    //API Data
    const [widgetData, setWidgetData] = useState([]);

    //masters
    const [zoneListData, setZoneListData] = useState([]);
    const [facilityTypeListData, setFacilityTypeListData] = useState([]);
    const [genericDrugListData, setGenericDrugListData] = useState([]);
    const [stateListData, setStateListData] = useState([]);
    const [groupListData, setGroupListData] = useState([]);
    const [stateJobListData, setStateJobListData] = useState([]);
    const [programmeListData, setProgrammeListData] = useState([]);

    //dropdowns
    const [hintQuestionDrpDt, setHintQuestionDrpDt] = useState([]);
    const [stateNameDrpDt, setStateNameDrpDt] = useState([]);
    const [supplierNameDrpDt, setSupplierNameDrpDt] = useState([]);
    const [districtNameDrpDt, setDistrictNameDrpDt] = useState([]);
    const [groupDrpData, setGroupDrpData] = useState([]);
    const [subGroupDrpData, setSubGroupDrpData] = useState([]);
    const [facilityTypeDrpDt, setFacilityTypeDrpDt] = useState([]);
    const [drugTypeDrpData, setDrugTypeDrpData] = useState([]);
    const [genericDrugDrpData, setGenericDrugDrpData] = useState([]);
    const [dateDrpDt, setDateDrpDt] = useState([]);
    const [testTypeDrpData, setTestTypeDrpData] = useState([]);
    const [hospNameDrpData, setHospNameDrpData] = useState([]);
    const [zoneDrpData, setZoneDrpData] = useState([]);
    const [iphsGroupDrpData, setIphsGroupDrpData] = useState([]);
    const [iphsSubGroupDrpData, setIphsSubGroupDrpData] = useState([]);
    const [iphsMedicineDrpData, setIphsMedicineDrpData] = useState([]);
    const [iphsDrugDrpData, setIphsDrugDrpData] = useState([]);

    // for qr code
    const [stateNameDrpDtQr, setStateNameDrpDtQr] = useState([]);
    const [facilityTypeDrpDtQr, setFacilityTypeDrpDtQr] = useState([]);
    const [storeNameDrpDtQr, setStoreNameTypeDrpDtQr] = useState([]);

    //confirm alert
    const [confirmSave, setConfirmSave] = useState(false);
    const [showConfirmSave, setShowConfirmSave] = useState(false);


    const getWidgetData = async (ids) => {
        const val = {
            ids: ids || [],
            dashboardFor: 'CENTRAL DASHBOARD',
            masterName: "DashboardWidgetMst"
        };
        fetchPostData('/hisutils/getWdgtMultipleData?isGlobal=1', val).then((data) => {
            if (data?.status === 1) {
                setWidgetData(data?.data)
            } else {
                setWidgetData([])
            }
        })
    }


    //-----------------------------------------------MASTERS----------------------------------------------
    const getZoneListData = (status) => {
        fetchData(`/api/v1/zones/status?status=${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setZoneListData(data?.data)
            } else {
                setZoneListData([])
            }
        })
    }

    const getFacilityTypeListData = (status) => {
        fetchData(`/api/v1/Facility/status?status=${status ? status : "1"}`).then((data) => {
            if (data.status == 1) {
                setFacilityTypeListData(data?.data)
            } else {
                setFacilityTypeListData([])
            }
        })
    }

    const getGenericDrugListData = (grpId, sbGrpId, status, categoryOptions) => {
        const params = {
            groupId: grpId ? grpId : '0',
            subgroupId: sbGrpId ? sbGrpId : "0",
            isValid: status ? status : "1"
        }

        fetchData(`/api/v1/drugs`, params).then((data) => {
            if (data?.status === 1) {
                setGenericDrugListData(data?.data)
            } else {
                setGenericDrugListData([])
            }
        })
    }

    const getStateListData = (status) => {
        fetchData(`/api/v1/State/${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setStateListData(data?.data)
            } else {
                setStateListData([])
            }
        })
    }
    const getGroupListData = (status) => {
        fetchData(`/api/v1/Group/status?status=${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setGroupListData(data?.data)
            } else {
                setGroupListData([])
            }
        })
    }

    const getStateJobDetailsListData = (stateId, status) => {
        fetchData(`/api/v1/stateJobDetails/getJobDetailsByStateID?stateID=${stateId ? stateId : '0'}&isActive=${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setStateJobListData(data?.data)
            } else {
                setStateJobListData([])
            }
        })
    }


    //----------------------------------Dropdowns----------------------------------------------------------
    const getHintQuestionDrpData = () => {
        fetchData('/api/v1/login/hntQueDropDown').then((data) => {
            if (data?.status === 1) {
                setHintQuestionDrpDt(data?.data)
            } else {
                setHintQuestionDrpDt([])
            }
        })
    }

    const getSteteNameDrpData = () => {
        fetchData('/api/v1/State/1').then((data) => {
            if (data?.status === 1) {

                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumStateId,
                        label: dt?.cwhstrStateName
                    }
                    return val;
                })
                setStateNameDrpDt(drpData)
            } else {
                setStateNameDrpDt([])
            }
        })
    }

    const getDateDrpData = () => {
        fetchData('/api/v1/outsourceMaster/getDateRange')
            .then((res) => {
                if (res && res.data) {
                    const drpData = res.data.map((date) => ({
                        value: date,
                        label: date
                    }));

                    setDateDrpDt(drpData);
                } else {
                    setDateDrpDt([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching date data:', error);
                setDateDrpDt([]);
            });
    };

    const getDistrictNameDrpData = (stateid) => {
        fetchData(`/api/v1/districts/getAllDistrictList?stateId=${stateid}&isActive=1`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumDistId,
                        label: dt?.cwhstrDistName
                    }

                    return val;
                })

                setDistrictNameDrpDt(drpData)

            } else {
                setDistrictNameDrpDt([])
            }
        })
    }

    const getSupplierNameDrpData = () => {
        fetchData('/api/v1/supplierMappingMaster/getAllSuppliers').then((data) => {
            if (data) {

                const drpData = data.data?.map((dt) => {
                    const val = {
                        value: dt?.supplierID,
                        label: dt?.supplierName
                    }

                    return val;
                })

                setSupplierNameDrpDt(drpData)

            } else {
                setSupplierNameDrpDt([])
            }
        })
    }

    const getGroupDrpData = () => {
        fetchData('/api/v1/GrpDrpdwn').then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.id,
                        label: dt?.name
                    }

                    return val;
                })
                setGroupDrpData(drpData)

            } else {
                setGroupDrpData([])
            }
        })
    }

    // const getGenericDrugDrpData = () => {
    //     fetchData('/api/v1/gnricDrugNameCombo').then((data) => {
    //         if (data?.status === 1) {
    //             const drpData = data?.data?.map((dt) => {
    //                 const val = {
    //                     value: dt?.cwhnumCentralDrugId,
    //                     label: dt?.cwhstrCentraldrugName
    //                 }

    //                 return val;
    //             })
    //             setGenericDrugDrpData(drpData)

    //         } else {
    //             setGenericDrugDrpData([])
    //         }
    //     })
    // }

    const getGenericDrugDrpData = () => {
        fetchData('/api/v1/gnricDrugNameCombo').then((data) => {
            if (data?.status === 1) {
                const drpData = [
                    ...new Map(
                        (Array.isArray(data?.data) ? data.data : [])
                            .filter(dt => dt?.cwhnumCentralDrugId != null)
                            .map(dt => [
                                dt.cwhnumCentralDrugId,
                                {
                                    value: dt.cwhnumCentralDrugId,
                                    label: dt?.cwhstrCentraldrugName || ''
                                }
                            ])
                    ).values()
                ];
                setGenericDrugDrpData(drpData);
            } else {
                setGenericDrugDrpData([]);
            }
        }).catch(() => {
            setGenericDrugDrpData([]);
        });
    };

    const getDrugTypeDrpData = () => {
        fetchData('/api/v1/DrugTypeDropdown').then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumDrugTypeId,
                        label: dt?.cwhstrDrugTypeName
                    }
                    return val;
                })
                setDrugTypeDrpData(drpData)
            } else {
                setDrugTypeDrpData([])
            }
        })
    }

    const getSubGroupDrpData = (grpId) => {
        fetchData(`/api/v1/SubGrpDrpDwn/${grpId}`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumSubgroupId,
                        label: dt?.cwhstrSubgroupName
                    }
                    return val;
                })
                setSubGroupDrpData(drpData)
            } else {
                setSubGroupDrpData([])
            }
        })
    }

    const getFacilityTypeDrpData = () => {
        fetchData('/api/v1/drpDwnFcltyTypMapMst').then((data) => {
            if (data?.status === 1) {
                setFacilityTypeDrpDt(data?.data)
            } else {
                setFacilityTypeDrpDt([])
            }
        })
    }

    const getTestTypeDrpData = () => {
        fetchData('/api/v1/outsourceMaster/getTestTypes').then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.testID,
                        label: dt?.testName
                    }
                    return val;
                })
                setTestTypeDrpData(drpData)
            } else {
                setTestTypeDrpData([])

            }
        })
    }

    const getZoneDrpData = () => {
        fetchData(`/api/v1/zones/status?status=1`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumZoneId,
                        label: dt?.cwhstrZoneName
                    }
                    return val;
                })
                setZoneDrpData(drpData)
            } else {
                setZoneDrpData([])
            }
        })
    }

    const getHospNameDrpData = (stateId, facilityId) => {
        fetchData(`/api/v1/outsourceMaster/getHospitalList?stateID=${stateId}&facilityTypeID=${facilityId}`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.storeID,
                        label: dt?.storeName
                    }
                    return val;
                })
                setHospNameDrpData(drpData)
            } else {
                setHospNameDrpData([])
            }
        })
    }

    const getIphsGroupDrpData = () => {
        fetchData(`/api/v1/IphsGroupMaster/getAllGroups?isActive=1`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumIphsGroupID,
                        label: dt?.cwhstrIphsGroupName
                    }
                    return val;
                })
                setIphsGroupDrpData(drpData)
            } else {
                setIphsGroupDrpData([])
            }
        })
    }

    const getIphsSubGroupDrpData = (groupId) => {
        fetchData(`/api/v1/IphsSubGroupMaster/getSubgroupsConditionally?groupID=${groupId}&isActive=1`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumIphsSubgroupID,
                        label: dt?.cwhstrIphsSubgroupName
                    }
                    return val;
                })
                setIphsSubGroupDrpData(drpData)
            } else {
                setIphsSubGroupDrpData([])
            }
        })
    }

    const getIphsMedicineDrpData = () => {
        fetchData(`/api/v1/IphsMoleculeDrugMst/getMedicineNames`).then((data) => {
            if (data?.status === 200) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.packID,
                        label: dt?.moleculeName
                    }
                    return val;
                })
                setIphsMedicineDrpData(drpData)
            } else {
                setIphsMedicineDrpData([])
            }
        })
    }

    const getIphsDrugDrpData = () => {
        fetchData(`/api/v1/IphsDrugMappingMst/getDrugnames`).then((data) => {
            console.log('data', data)
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.packID,
                        label: dt?.moleculeName
                    }
                    return val;
                })
                setIphsDrugDrpData(drpData)
            } else {
                setIphsDrugDrpData([])
            }
        })
    }

    const getProgrammeListData = (status) => {
        fetchData(`/api/v1/programmes/all?isActive=${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setProgrammeListData(data?.data)
            } else {
                setProgrammeListData([])
            }
        })
    }

    //for qr code

    const getStateNameDrpDataQr = () => {
        fetchData(`/api/v1/state-combo-Scanner`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.id,
                        label: dt?.name
                    }
                    return val;
                })
                setStateNameDrpDtQr(drpData);
            } else {
                setStateNameDrpDtQr([]);
            }
        })
    }

    const getStoreNameDrpDataQr = (stateId, facilityId) => {
        fetchData(`/api/v1/store-combo?stateId=${stateId}&facilityTypeId=${facilityId}`).then((data) => {
            console.log('data', data)
            if (data?.status === 1) {

                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.storeId,
                        label: dt?.storeName
                    }
                    return val;
                })
                setStoreNameTypeDrpDtQr(drpData);
            } else {
                setStoreNameTypeDrpDtQr([]);
            }
        })
    }

    const getFacilityTypeDrpDataQr = () => {
        fetchData(`/api/v1/facility-type-combo`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.id,
                        label: dt?.name
                    }
                    return val;
                })
                setFacilityTypeDrpDtQr(drpData);
            } else {
                setFacilityTypeDrpDtQr([]);
            }
        })
    }

    return (
        <LoginContext.Provider value={{
            widgetData, getWidgetData,
            showCmsLogin, setShowCmsLogin,
            showForgotPass, setShowForgotPass,
            getHintQuestionDrpData, hintQuestionDrpDt,
            getSteteNameDrpData, stateNameDrpDt,
            getSupplierNameDrpData, supplierNameDrpDt,
            getDistrictNameDrpData, districtNameDrpDt,
            selectedOption, setSelectedOption,
            openPage, setOpenPage,
            getGroupDrpData, groupDrpData, getSubGroupDrpData, subGroupDrpData,
            facilityTypeDrpDt, getFacilityTypeDrpData,
            drugTypeDrpData, getDrugTypeDrpData,
            genericDrugDrpData, getGenericDrugDrpData,
            dateDrpDt, getDateDrpData,
            testTypeDrpData, getTestTypeDrpData,
            hospNameDrpData, getHospNameDrpData,
            zoneDrpData, getZoneDrpData,
            isShowReport, setIsShowReport,
            iphsGroupDrpData, getIphsGroupDrpData,
            iphsSubGroupDrpData, getIphsSubGroupDrpData,
            iphsMedicineDrpData, getIphsMedicineDrpData,
            iphsDrugDrpData, getIphsDrugDrpData,
            getFacilityTypeDrpDataQr, getStoreNameDrpDataQr, getStateNameDrpDataQr,
            stateNameDrpDtQr, storeNameDrpDtQr, facilityTypeDrpDtQr,


            //confirm box
            showConfirmSave, setShowConfirmSave, confirmSave, setConfirmSave,


            //-----------masters----------
            getZoneListData, zoneListData,
            getFacilityTypeListData, facilityTypeListData,
            getGenericDrugListData, genericDrugListData,
            getStateListData, stateListData,
            getGroupListData, groupListData,
            getStateJobDetailsListData, stateJobListData,
            getProgrammeListData, programmeListData
        }}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContextApi