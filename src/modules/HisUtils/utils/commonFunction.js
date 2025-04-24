import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchPostData } from '../../../utils/ApiHooks';

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

//FUNCTION TO TRANSFORM DATA ACCORDING TO DROPDOWN - TWO COLUMNS
export const DrpDataValLab = (data, col1, col2, isJson) => {
  if (isJson) {
    const result = data?.map((item) => ({
      value: item?.jsonData?.[col1] || "",
      label: item?.jsonData?.[col2] || "",
    }));
    return result;
  } else {
    const result = data?.map((item) =>
      ({ value: item[col1], label: item[col2] })
    )
    return result
  }
}

//FUNCTION TO TRANSFORM DATA ACCORDING TO DROPDOWN - THREE COLUMNS
export const ThreeColDrpData = (data, col1, col2, col3) => {
  const result = data?.map((item) =>
    ({ value: item[col1], label: item[col2], filterID: item[col3] })
  )
  return result
}

export const convertToISODate = (dateStr) => {

  if (!dateStr) return "";
  const months = {
    JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
    JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
  };

  const [day, month, year] = dateStr.split("-");
  const formattedYear = `20${year}`;
  const formattedMonth = months[month.toUpperCase()];

  return `${formattedYear}-${formattedMonth}-${day}`;
};

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
    const response = await fetchPostData("/hisutils/GenericApiQry", requestBody);

    return response  || [];
  } catch (error) {
    console.error("Error fetching query data:", error);
    return [];
  }
};

export const fetchProcedureData = async (procedure,params) => {
  if (!procedure) {
    return [];
  }

  try {
    const requestBody = {
      "procedureName": procedure,
      "parameters":params
    };
    const response = await fetchPostData(`api/procedures/execute`, requestBody);

    return response || [];
  } catch (error) {
    console.error("Error fetching query data:", error);
    return [];
  }
};

export const fetchLogoAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


export const fetchLocalLogoAsBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = filePath;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const base64String = canvas.toDataURL('image/jpeg').split(',')[1];
      resolve(base64String);
    };

    img.onerror = (err) => reject(`Failed to load image: ${err.message}`);
  });
};


