import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchPostData } from "../../../utils/ApiHooks";

export const fetchQueryData = async (queryVO = [], jndiServer) => {
  if (!Array.isArray(queryVO) || queryVO.length === 0) {
    console.error("Invalid or empty queryVO array provided.");
    return [];
  }

  try {
    const query = queryVO[0]?.mainQuery;
    if (!query) {
      console.error("No valid query found in queryVO.");
      return [];
    }

    const requestBody = { query, params: {} };
    const response = await fetchPostData(
      "http://10.226.25.164:8024/hisutils/GenericApiQry",
      requestBody
    );

    return response?.data || [];
  } catch (error) {
    console.error("Error fetching query data:", error);
    return [];
  }
};

//FUNCTION TO MANAGE GLOBAL ALERTS
export const ToastAlert = (message, type) => {
  toast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    type: type,
  });
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function getClusteredTablenames(clusterTableArray) {
  return clusterTableArray.length
    ? clusterTableArray.map((item) => item.split(",")[0]).join(" | ")
    : "";
}

export async function executeSqlQuery(sqlQuery) {
  try {
    const response = await fetch("http://localhost:8025/api/v1/execute-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: sqlQuery,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Table Data:", error);
  }
}

export async function fetchDrilldownData(params) {
  try {
    const response = await fetch(
      "http://localhost:8025/api/v1/fetchDrilldownData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: params,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Table Data:", error);
  }
}

export default async function saveDashboardData(requestData) {
  // Make the POST request
  try {
    const response = await fetch(
      "http://localhost:8025/api/v1/save-dashboard",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    return response.json();
  } catch (error) {
    return error;
  }
}
