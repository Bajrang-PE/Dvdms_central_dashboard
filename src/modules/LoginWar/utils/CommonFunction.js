import { fetchPostData } from "./ApiHooks";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const fetchQueryData = async (queryVO = []) => {
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
        const response = await fetchPostData("http://10.226.25.164:8024/hisutils/GenericApiQry", requestBody);
  
        return response || [];
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
      type: type
    });
  }

  export const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };