import axios from 'axios';
import { decryptAesOrRsa, encryptAesData } from './SecurityConfig';


// const BaseUrl = import.meta.env.VITE_HIS_API_BASE_URL
// 
const BaseUrl = 'http://10.226.25.164:8024'; //prSitee//
// const BaseUrl = 'http://10.10.10.177:8024'; //prSitee//
// const BaseUrl = 'http://10.226.17.6:8024';  //BG     
// const BaseUrl = 'http://10.226.29.211:8025/';  //Disha
// const BaseUrl = 'http://10.226.29.102:8025/';  //shubham
// const BaseUrl = 'http://10.226.30.45:8025/';  //pradeep
// const BaseUrl = 'http://10.226.26.247:8025/';  //harsh
// const BaseUrl = 'http://10.226.80.61:8024/';  //server
// const BaseUrl = 'https://nppa.uat.dcservices.in';  //se

const apiHis = axios.create({
    baseURL: BaseUrl
});

//axios.defaults.baseURL = BaseUrl;

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const getCsrfToken = () => {
    return Cookies.get('csrfToken');
};

// Set the Authorization header globally using an interceptor
// apiHis.interceptors.request.use(
//     (config) => {
//         const accessToken = getAccessToken();
//         // const CsrfToken = getCsrfToken();
//         if (accessToken) {
//             config.headers['Authorization'] = `Bearer ${accessToken}`;
//             // config.headers['X-CSRF-TOKEN'] = CsrfToken;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// apiHis.interceptors.response.use(
//     async (response) => {
//         if (response?.data?.status && response?.data?.status === 401) {
//             ToastAlert('Session expired. Please log in again.', 'error');
//         } else {
//             return response;
//         }
//     },
//     async (error) => {
//          console.log(error,'errorerror')
//         if (error.response) {
//             const { status, data } = error.response;
//             if (status === 401 || status === 403) {
//                 // Token is expired or unauthorized
//                 ToastAlert(data?.error, 'error');
//             }
//         }
//         // Return the error to allow further handling
//         return Promise.reject(error);
//     }
// );


//API FUNCTION TO FETCH DATA
export const fetchData = async (url, params) => {
    try {
        if (params) {
            const response = await apiHis.get(url, { params: params ? params : '' });
            // console.log(response,url)
            // return response?.data
            const decryptedData = decryptAesOrRsa(response?.data)
            // console.log(JSON.parse(decryptedData),url,'bajrang');
            return JSON.parse(decryptedData);
        } else {
            const response = await apiHis.get(url);
            const decryptedData = decryptAesOrRsa(response?.data)
            // console.log(JSON.parse(decryptedData),url);
            return JSON.parse(decryptedData);
            // return response?.data
        }
    } catch (error) {
        console.error('API Error:', error);
    }
};

export const fetchPostData = async (url, data, rtblob) => {
    try {
        if (rtblob) {
            const response = await apiHis.post(url, data, rtblob);
            //  const decryptedData = decryptAesOrRsa(response?.data)
            //  return JSON.parse(decryptedData);
            return response;
        } else {
            const response = await apiHis.post(url, encodeURIComponent(encryptAesData(JSON?.stringify(data))));
            const decryptedData = decryptAesOrRsa(response?.data)
            return JSON.parse(decryptedData);
            // return response.data;
        }

    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};

export const fetchUpdateData = async (url, data) => {
    try {
        const response = await apiHis.put(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }

};

export const fetchUpdatePostData = async (url, data) => {
    try {
        const response = await apiHis.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};

export const fetchDeleteData = async (url, payload) => {
    try {
        const response = await apiHis.delete(url, { data: payload ? payload : '' });
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};