import axios from 'axios';
import { decryptAesOrRsa, encryptAesData } from './SecurityConfig';
import { ToastAlert } from '../modules/login-war/utils/CommonFunction';

// const BaseUrl = import.meta.env.VITE_API_BASE_URL
const BaseUrl = 'http://10.226.28.223:8025'

const apiLogin = axios.create({
    baseURL: '',
    // withCredentials: true,
});

//axios.defaults.baseURL = BaseUrl;

const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
};

const getCsrfToken = () => {
    return Cookies.get('csrfToken');
};

const logout = () => {
    localStorage.clear();
       sessionStorage.clear();
    Cookies.remove('csrfToken');
};

// Set the Authorization header globally using an interceptor
apiLogin.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        // const CsrfToken = getCsrfToken();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            // config.headers['X-CSRF-TOKEN'] = CsrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiLogin.interceptors.response.use(
    async (response) => {
        if (response?.data?.status && response?.data?.status === 401) {
            ToastAlert('Session expired. Please log in again.', 'error');
            logout();
            window.location.href = "/dvdms/session-expired";
        } else {
            return response;
        }
    },
    async (error) => {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401 || status === 403) {
                // Token is expired or unauthorized
                ToastAlert(data?.error ? data?.error : "Origin not allowed!", 'error');
            }
        }
        // Return the error to allow further handling
        return Promise.reject(error);
    }
);

//API FUNCTION TO FETCH DATA
export const fetchData = async (url, params) => {
    try {
        if (params) {
            const response = await apiLogin.get(url, { params: params ? params : '' });
            const decryptedData = decryptAesOrRsa(response?.data)
            // console.log(JSON.parse(decryptedData),url,'bajrang');
            return JSON.parse(decryptedData);
            // return response?.data
        } else {
            const response = await apiLogin.get(url);
            // return response?.data
            const decryptedData = decryptAesOrRsa(response?.data);
            console.log('response', decryptedData);
            return JSON.parse(decryptedData);
        }
    } catch (error) {
        console.error('API Error:', error);
    }
};

export const fetchPostData = async (url, data) => {
    try {
        // const response = await apiLogin.post(url, data);
        // console.log('response', response);
        // return response.data;
        const response = await apiLogin.post(url, encodeURIComponent(encryptAesData(JSON?.stringify(data))),
            {
                headers: {
                    "Content-Type": "text/plain",
                },
            }
        );
        const decryptedData = decryptAesOrRsa(response?.data);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};

export const fetchUpdateData = async (url, data) => {
    try {
        const response = await apiLogin.put(url, encodeURIComponent(encryptAesData(JSON?.stringify(data))));
        // const response = await apiLogin.put(url, data);
        // return response.data;
        const decryptedData = decryptAesOrRsa(response?.data);
        return JSON.parse(decryptedData);

    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }

};

export const fetchUpdatePostData = async (url, data) => {
    try {
        const response = await apiLogin.post(url, data && encodeURIComponent(encryptAesData(JSON?.stringify(data))), {
            headers: {
                "Content-Type": "text/plain",
            },
        });
        const decryptedData = decryptAesOrRsa(response?.data);
        return JSON.parse(decryptedData);
        // return response.data;
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};

export const fetchDeleteData = async (url, payload) => {
    try {
        const response = await apiLogin.delete(url, { data: payload });
        // return response.data;
        const decryptedData = decryptAesOrRsa(response?.data);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};

export const fetchPatchData = async (url, payload) => {
    try {
        const response = await axios.patch(url, encodeURIComponent(encryptAesData(JSON?.stringify(payload))));
        // return response.data;
        const decryptedData = decryptAesOrRsa(response?.data);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};

// API FUNCTION TO FETCH BLOB / IMAGE DATA
export const fetchBlobData = async (url, params = null) => {

    try {
        let response;
        if (params) {
            response = await apiLogin.get(url, {
                params,
                responseType: 'blob'
            });
        } else {
            response = await apiLogin.get(url, {
                responseType: 'blob'
            });
        }
        return response.data;
    } catch (error) {
        console.error('BLOB API Error:', error);
        throw error;

    }
};