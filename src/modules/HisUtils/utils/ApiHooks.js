import axios from 'axios';
// import { decryptAesOrRsa, encryptAesData } from './EncDecSecurity';
// import { ToastAlert } from './commonFunction';
// import Cookies from 'js-cookie';

// const BaseUrl = 'http://10.226.50.25:8003';
const BaseUrl = 'http://10.226.25.164:8024';  //pritee
// const BaseUrl = 'http://10.226.17.6:8024';  //BG
// const BaseUrl1 = 'http://10.226.29.211:8025/';  //Disha


axios.defaults.baseURL = BaseUrl;

// Set the Authorization header globally using an interceptor
// axios.interceptors.request.use(
//     (config) => {
//         const accessToken = getAccessToken();
//         const CsrfToken = getCsrfToken();
//         if (accessToken) {
//             config.headers['Authorization'] = `Bearer ${accessToken}`;
//             config.headers['X-CSRF-TOKEN'] = CsrfToken;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// axios.interceptors.response.use(
//     async (response) => {
//         if (response?.data?.status && response?.data?.status === 401) {
//             ToastAlert('Session expired. Please log in again.', 'error');
//         } else {
//             return response;
//         }
//     },
//     async (error) => {
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
            const response = await axios.get(url, { params: params ? params : '' });
            // console.log(response?.data, 'get')
            return response?.data
        } else {
            const response = await axios.get(url);
            // const decryptedData = decryptAesOrRsa(response?.data)
            // console.log(JSON.parse(decryptedData), 'getbgbg')
            // return JSON.parse(decryptedData);
            // console.log(response?.data, 'get')
            return response?.data
        }

        // }
    } catch (error) {
        console.error('API Error:', error);
    }
};


//API FUNCTION TO DELETE DATA
// export const deleteFetchData = async (url) => {
//     try {
//         const response = await axios.delete(url);
//         console.log(response?.data, 'delete')
//         return response.data;
//     } catch (error) {
//         console.error('API Error:', error);
//     }
// };

//API FUNCTION TO UPDATE DATA
export const fetchUpdateData = async (url, data) => {
    try {
        const response = await axios.put(url, data);
        // console.log(response?.data, 'put')
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
    }
};

//API FUNCTION TO POST DATA
export const fetchPostData = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        // console.log('bgbbgbgbg')
    }
};