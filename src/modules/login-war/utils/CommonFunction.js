import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchPostData } from '../../../utils/ApiHooks';

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
    const response = await fetchPostData("http://10.226.25.164:8024/hisutils/GenericApiQry", requestBody);

    return response;
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


export const formatDate1 = (isoDate) => {
  const dateObject = new Date(isoDate);
  // dateObject.setUTCHours(dateObject.getUTCHours() + dateObject.getTimezoneOffset() / 60);

  const day = dateObject.getUTCDate().toString().padStart(2, '0');
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dateObject.getUTCMonth()];
  const year = dateObject.getUTCFullYear();
  return `${day}-${month}-${year.toString().slice(-2)}`;
}