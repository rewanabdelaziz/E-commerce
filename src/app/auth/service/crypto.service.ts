import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }
  private secretKey = 'Rewan-15@5#02$';  
  
  // Encrypt the data using AES (Symmetric Key) encryption
  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }
  
  // Decrypt the data using AES (Symmetric Key) decryption
  decrypt(ciphertext: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null
    } catch (e) {
      return null;
    }
  }
}
