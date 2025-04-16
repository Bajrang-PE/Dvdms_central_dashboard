import { decryptData } from "../modules/LoginWar/utils/SecurityConfig";


export const getAuthUserData = (key) => {
    const sessionData = sessionStorage.getItem('data');
    const userData = sessionData ? decryptData(sessionData) : '';
    const val = userData[key] || '';
    return val;
}