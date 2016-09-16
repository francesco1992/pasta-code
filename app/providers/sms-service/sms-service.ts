import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Base64 } from "./base64-enc-dec";

/*
  Generated class for the SmsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SmsService {
  private const
  apiEndPoint: string = 'https://api.twilio.com/2010-04-01/';
  private credentials;

  constructor(private http: Http) {
    this.credentials = {
      accountSid: '',
      authToken: ''
    }
  }

  // set credentials for twilio authentication
  setCredentials(credentials) {
    this.credentials.accountSid = credentials.accountSid;
    this.credentials.authToken = credentials.authToken;
  }

  //generate base url for http request
  private generateUrl() {
    if(!this.credentials) {
      throw new Error("Provide valid credentials");
    }
    return this.apiEndPoint +
      "Accounts/" +
      this.credentials.accountSid +
      "/Messages.json";
  }

  // serialize data to be sent through http
  private serializeData(data) {
    var buffer = [];
    // Serialize each key in the object.
    for (let i in data) {
      if (!data.hasOwnProperty(i)) continue;
      var value = data[i];
      buffer.push(
        encodeURIComponent(i) +
        '=' +
        encodeURIComponent((value === null) ? '' : value )
      );
    }

    // Serialize the buffer and clean it up for transportation.
    var source = buffer
      .join('&')
      .replace(/%20/g, '+');
    return source;
  }

  // return encoded base64 credentials
  private getBase64Credentials() {
    console.log(new Base64().encode(this.credentials.accountSid + ':' +
      this.credentials.authToken));
    return new Base64().encode(this.credentials.accountSid + ':' +
      this.credentials.authToken);
  }

  // return headers of http request
  private generateHeaders() {
    let headers = new Headers();
    headers.append('Authorization', "Basic " +
      this.getBase64Credentials());
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    return headers;
  }

  // send message using twilio HTTP Rest API
  sendMessage(data) {
    let url = this.generateUrl();
    let body = this.serializeData(data);
    let headers = this.generateHeaders();

    return this.http.post(url, body.toString(), {
      headers: headers
    });
  }

  constructor(private http: Http) {}

}

