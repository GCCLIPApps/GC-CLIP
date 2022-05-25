import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { DataSchema } from '../data-schema';
import * as CryptoJS from 'crypto-js';
import * as encHex from 'crypto-js/enc-hex';
import * as aes from 'crypto-js/aes';
import * as padZeroPadding from 'crypto-js/pad-zeropadding';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private keyString = new DataSchema();
  private key: any;
  private iv: any;
  constructor(private _http: HttpClient, private _user: UserService) { 

  }
  processData1(api: string, load:any, sw:number){


    switch(sw){
      
      // Request Login
      case 1:
        return this._http.post(this._user.apiLink +  btoa(api).replace('=',''), this.encrypt(encodeURIComponent(unescape(JSON.stringify(load)))));
      break;
      
      // Request with Authentication 
      case 2:
        let payload = {load: load, token: this._user.getToken(), userid: this._user.getUserID() }

        return this._http.post(this._user.apiLink +  btoa(api).replace('=',''), this.encrypt(encodeURIComponent(unescape(JSON.stringify(payload)))));
        // console.log(load.get('image'))
      break;

      case 3:
        // console.log(load.get('image'))
        return this._http.post(this._user.apiLink + btoa(api).replace('=',''), load);
      break;


      default: 
      break;
     }
  
  }

  //Payload Encryption
  private encrypt(msg:any){
    let keyString = this.keyString.genHexString(32);
    let ivString = this.keyString.genHexString(32);

   
    let key = encHex.parse(keyString);
    let iv =  encHex.parse(ivString); 

    let ciphertext =  this.keyString.generateSalt()+iv+key+aes.encrypt(msg, key, {iv: iv, padding:padZeroPadding}).toString();
    
    // this.decrypt(ciphertext);

    return ciphertext;
  }

  //Response Payload Decryption
  decrypt(encryptedString:any ) {
    let key = this.keyString.defaultmessage;
    let encryptMethod = 'AES-256-CBC';

    let encryptLength = parseInt(encryptMethod.match(/\d+/)![0]);
    
    let json = JSON.parse(
      CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString))
    );
    let salt = CryptoJS.enc.Hex.parse(json.salt);
    let iv = CryptoJS.enc.Hex.parse(json.iv);

    let encrypted = json.ciphertext;

    let iterations = parseInt(json.iterations);
    if (iterations <= 0) {
      iterations = 999;
    }
    let encryptMethodLength = encryptLength / 4;
    let hashKey = CryptoJS.PBKDF2(key, salt, {
      hasher: CryptoJS.algo.SHA256,
      keySize: encryptMethodLength / 8,
      iterations: iterations,
    });
    
    let decrypted = CryptoJS.AES.decrypt(encrypted, hashKey, {
      mode: CryptoJS.mode.CBC,
      iv: iv,
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
  // private decrypt(encrypt:any){
  //   let ciphertext = encrypt
  //   let key = encHex.parse(ciphertext.substr(43,32))
  //   let iv =  encHex.parse(ciphertext.substr(11,32))

  //   var decrypted = aes.decrypt(ciphertext.substr(75), key, {iv:iv, padding:padZeroPadding}).toString(CryptoJS.enc.Utf8);
    
  //   return  JSON.parse(decodeURIComponent(decrypted));
    
  // }
}
