import axios from 'axios';

const BaseUrl = 'http://10.226.25.164:8025'; //pritee
// const BaseUrl = 'http://10.226.17.6:8025';  //BG
// const BaseUrl = 'http://10.226.29.211:8025/';  //Disha
// const BaseUrl = 'http://10.226.29.102:8025/';  
// const BaseUrl = 'http://10.226.30.45:8025/';  //pradeep

axios.defaults.baseURL = BaseUrl;

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};
const getCsrfToken = () => {
    return Cookies.get('csrfToken');
};

// Set the Authorization header globally using an interceptor
// axios.interceptors.request.use(
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
            return response?.data
        } else {
            const response = await axios.get(url);
            return response?.data
        }
    } catch (error) {
        console.error('API Error:', error);
    }
};

export const fetchPostData = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        return error?.response?.data;
    }
};

export const fetchUpdateData = async (url, data) => {
    try {
        const response = await axios.put(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        return error?.response?.data;
    }

};

export const fetchUpdatePostData = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        return error?.response?.data;
    }
};

export const fetchDeleteData = async (url, data) => {
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        return error?.response?.data;
    }
};