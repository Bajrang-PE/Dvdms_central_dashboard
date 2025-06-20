import React, { createContext, useState } from 'react'
import { DrpDataValLab, ToastAlert } from '../utils/commonFunction';
import { fetchData, fetchDeleteData } from '../../../utils/HisApiHooks';

export const HISContext = createContext();

const HISContextData = ({ children }) => {
  //GLOBALS
  const [showDataTable, setShowDataTable] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [actionMode, setActionMode] = useState('home');
  const [activeTab, setActiveTab] = useState();
  const [theme, setTheme] = useState('Default');
  const [mainDashData, setMainDashData] = useState(null);

  const [confirmSave, setConfirmSave] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleConfigData, setSingleConfigData] = useState();

  const [prevKpiTab,setPrevKpiTab] = useState([]);

  const [paramsValues, setParamsValues] = useState({
    tabParams: {},
    widgetParams: {},
  });
  const [paramsValuesPro, setParamsValuesPro] = useState({
    tabParams: {},
    widgetParams: {},
  });
  const [isSearchQuery, setIsSearchQuery] = useState(false);

  const [presentWidgets, setPresentWidgets] = useState([]);


  // ALL DATA
  const [parameterData, setParameterData] = useState([]);
  const [allWidgetData, setAllWidgetData] = useState([]);
  const [dataServiceData, setDataServiceData] = useState([]);
  const [allTabsData, setAllTabsData] = useState([]);
  const [userServiceData, setUserServiceData] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardSubmenuData, setDashboardSubmenuData] = useState([]);

  //DROPDOWN DATA
  const [dashboardForDt, setDashboardForDt] = useState([]);
  const [parameterDrpData, setParameterDrpData] = useState([]);
  const [widgetDrpData, setWidgetDrpData] = useState([]);
  const [tabDrpData, setTabDrpData] = useState([]);
  const [dataServiceDrpData, setDataServiceDrpData] = useState([]);
  const [serviceCategoryDrpData, setServiceCategoryDrpData] = useState([]);
  const [jndiServerDrpData, setJndiServerDrpData] = useState([]);

  // dropdowns api call
  const getDashboardForDrpData = () => {
    fetchData("hisutils/dashboardfor").then((data) => {
      if (data?.status === 1) {
        setDashboardForDt(data?.data);
      } else {
        setDashboardForDt([]);
      }
    })
  }

  const getServiceCategoryDrpData = () => {
    fetchData("hisutils/serviceCategory").then((data) => {
      if (data?.status === 1) {
        setServiceCategoryDrpData(data?.data);
      } else {
        setServiceCategoryDrpData([]);
      }
    })
  }


  //all data
  const getAllParameterData = (dashFor) => {
    fetchData("/hisutils/parameterAll", { 'masterName': dashFor }).then((data) => {
      if (data?.status === 1) {
        setParameterData(data?.data);
        setParameterDrpData(DrpDataValLab(data?.data, 'parameterId', 'parameterName', true))
      } else {
        setParameterData([]);
        setParameterDrpData([]);
      }
    })
  }

  const getAllServiceData = () => {
    fetchData("/hisutils/DataServiceDetails", { 'masterName': "GLOBAL" }).then((data) => {
      if (data?.status === 1) {
        setDataServiceData(data?.data);
        setDataServiceDrpData(DrpDataValLab(data?.data, 'serviceId', 'serviceName', true))
      } else {
        setDataServiceData([]);
        setDataServiceDrpData([]);
      }
    })
  }

  const getUserServiceData = () => {
    fetchData("/hisutils/ServiceUserDetails", { 'masterName': "GLOBAL" }).then((data) => {
      if (data?.status === 1) {
        setUserServiceData(data?.data);
        // setParameterDrpData(DrpDataValLab(data, 'parameterId', 'parameterName',true))
      } else {
        setUserServiceData([]);
        // setParameterDrpData([]);
      }
    })
  }

  const getDashboardSubmenuData = () => {
    fetchData("/hisutils/DashboardsubMenuAll").then((data) => {
      if (data?.status === 1) {
        setDashboardSubmenuData(data?.data);
        // setParameterDrpData(DrpDataValLab(data, 'parameterId', 'parameterName',true))
      } else {
        setDashboardSubmenuData([]);
        // setParameterDrpData([]);
      }
    })
  }

  const getAllTabsData = (dashFor) => {
    fetchData("/hisutils/TabDetails", { 'masterName': dashFor }).then((data) => {
      if (data?.status === 1) {
        setAllTabsData(data?.data);
        setTabDrpData(DrpDataValLab(data?.data, 'dashboardId', 'dashboardName', true))
      } else {
        setAllTabsData([]);
        setTabDrpData([]);
      }
    })
  }

  const getAllWidgetData = (dashFor) => {
    fetchData("/hisutils/allWidgetConfiguration", { 'dashboardFor': dashFor }).then((data) => {
      if (data?.status === 1) {
        const fdt = data?.data?.filter(dt => dt?.rptId !== undefined && dt?.rptId !== null && dt?.rptId !== '');
        setAllWidgetData(fdt);
        setWidgetDrpData(DrpDataValLab(fdt, 'rptId', 'rptName', false))
      } else {
        setAllWidgetData([]);
        setWidgetDrpData([]);
      }
    })
  }

  const getAllDashboardData = (dashFor) => {
    fetchData("/hisutils/dashboardAll", { 'masterName': dashFor }).then((data) => {
      if (data?.status === 1) {
        setDashboardData(data?.data);
        // setTabDrpData(DrpDataValLab(data, 'dashboardId', 'dashboardName', true))
      } else {
        setDashboardData([]);
        // setTabDrpData([]);
      }
    })
  }

  const getDashConfigData = () => {
    fetchData("/hisutils/dashboard-configurations").then((data) => {
      if (data?.status === 1) {
        setSingleConfigData(data?.data)

        const config = data?.data?.databaseConfigVO;
        const jndiKeys = [
          { key: "jndiForPrimaryServer", label: "Primary" },
          { key: "jndiForSecondaryServer1", label: "Secondary 1" },
          { key: "jndiForSecondaryServer2", label: "Secondary 2" },
          { key: "jndiForSecondaryServer3", label: "Secondary 3" }
        ];

        const jndiServerOptions = jndiKeys
          .map(({ key, label }) => {
            const value = config?.[key];
            return value && value.trim() !== ""
              ? { value, label: `${label} - ${value}` }
              : null;
          })
          .filter(Boolean);

        setJndiServerDrpData(jndiServerOptions)

      } else {
        setSingleConfigData(null)
      }
    })
  }

  const clearAllCache = () => {
    fetchDeleteData('hisutils/clearCache').then((data) => {
      if (data?.status === 1) {
        ToastAlert(data?.message)
      } else {
        ToastAlert(data?.message, 'error')
      }
    })
  }

  return (
    <HISContext.Provider value={{
      //GLOBALS-----------------------------------
      // show table status
      showDataTable, setShowDataTable,
      selectedOption, setSelectedOption,
      actionMode, setActionMode,
      showConfirmSave, setShowConfirmSave, confirmSave, setConfirmSave,
      loading, setLoading,
      activeTab, setActiveTab,
      theme, setTheme,
      mainDashData, setMainDashData,
      singleConfigData, getDashConfigData, jndiServerDrpData,
      clearAllCache,prevKpiTab,setPrevKpiTab,

      paramsValues, setParamsValues,
      paramsValuesPro, setParamsValuesPro,
      isSearchQuery, setIsSearchQuery,

      // DROP DOWNS-------------------------------
      // DASHBOARD FOR
      dashboardForDt, getDashboardForDrpData,
      parameterDrpData,
      widgetDrpData,
      tabDrpData,
      dataServiceDrpData,
      serviceCategoryDrpData, getServiceCategoryDrpData,

      // ALL DATA----------------------------------
      //PARAMETER DATA
      parameterData, getAllParameterData,
      // WIDGET DATA
      allWidgetData, getAllWidgetData,
      //data/web services
      getAllServiceData, dataServiceData,
      //tabs data
      getAllTabsData, allTabsData,
      //userservice
      getUserServiceData, userServiceData,
      //dashboard data
      getAllDashboardData, dashboardData,
      //dashboard submenu
      dashboardSubmenuData, getDashboardSubmenuData,

      presentWidgets, setPresentWidgets
    }}>
      {children}
    </HISContext.Provider>
  )
}

export default HISContextData
