import CryptoJS from 'crypto-js';

const key = import.meta.env.VITE_AUTH_ENCRYPT_KEY;

//Encrypt Data
export function encryptData(data) {
    const ciphertext = CryptoJS.AES.encrypt(data, key).toString();
    return ciphertext;
  }
  
  // Decryption function
  export function decryptData(data) {
    const bytes = CryptoJS.AES.decrypt(data, key);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    const parseddt = JSON.parse(plaintext);
    return parseddt;
  }