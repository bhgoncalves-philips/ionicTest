import { Http, Response, Headers, ResponseOptions } from "@angular/http";
import { HTTP } from '@ionic-native/http';
import { Observable } from "rxjs/Observable";
import { fromPromise } from "rxjs/observable/fromPromise";
import 'rxjs/add/operator/mergeMap'
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
/*
  Generated class for the BaseApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BaseApiProvider {

  public isFormDataRequest: boolean;
  private url: string
  private postmonUrl: string;
  private headers: Headers = new Headers();
  private BASE_URL = "https://medlog-poc.herokuapp.com/v1/"
  private LOCAL_URL = "/medlog/"


  constructor(private http: Http, private nativeHTTP: HTTP, private plt: Platform) {

    this.resetHeaders()
    if (!this.plt.is('mobileweb') && !this.plt.is('core')) {
      this.url = this.BASE_URL;
    } else {
      this.url = this.LOCAL_URL;
    }
  }

  get(apiEndpoint: string, headers: HeaderModel[] = null): Observable<Response> {
    this.resetHeaders(headers);
    if (!this.plt.is('mobileweb') && !this.plt.is('core')) {
      return this.nativeGet(this.url + apiEndpoint);
    } else {
      return this.webGet(this.url + apiEndpoint);
    }
  }

  getPostmon(parameter: string, headers: HeaderModel[] = null) {
    this.resetHeaders(headers);
    let url = this.postmonUrl;
    if (!this.plt.is('mobileweb') && !this.plt.is('core')) {
      return this.nativeGet(url + parameter);
    } else {
      return this.webGet(url + parameter);
    }
  }

  post(apiEndpoint, body, headers: HeaderModel[] = null,isFormDataRequest:boolean = false): Observable<Response> {
    this.resetHeaders(headers,isFormDataRequest);
    if (!this.plt.is('mobileweb') && !this.plt.is('core') && !isFormDataRequest) {
      return fromPromise(this.nativeHTTP.post(this.url + apiEndpoint, body, {}).then((httpResponse) => {
        return this.parseHttpResponse(httpResponse);
      }));
    } else {
      return this.http.post(this.url + apiEndpoint, body, { headers: this.headers });
    }
  }

  nativeGet(apiEndpoint: string): Observable<Response> {
    return fromPromise(this.nativeHTTP.get(apiEndpoint, {}, {}).then(data => {
      console.log(data.url);
      console.log(data.status);
      console.log(data.data); // data received by server
      console.log(data.headers);
      return data;
    })
      .catch(error => {
        console.log(error.url);
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      }).then((httpResponse) => {
        return this.parseHttpResponse(httpResponse);
      }));
  }

  webGet(apiEndpoint: string): Observable<Response> {
    return this.http.get(apiEndpoint, { headers: this.headers })
  }

  private parseHttpResponse(httpResponse): Response {
    let responseOptions = new ResponseOptions({
      body: httpResponse.data,
      status: httpResponse.status,
      url: httpResponse.url,
      headers: httpResponse.headers,
    });

    return new Response(responseOptions);
  }

  private resetHeaders(additionalHeaders: HeaderModel[] = null, isFormDataRequest:boolean=false) {
    this.headers = null;
    this.nativeHTTP = null;
    this.headers = new Headers();
    this.nativeHTTP = new HTTP();

    if (!this.plt.is('mobileweb') && !this.plt.is('core')) {
      this.nativeHTTP.clearCookies();
      if (isFormDataRequest) {
      } else {
        this.nativeHTTP.setHeader('*', "Content-Type", "application/json;charset=utf-8");
      }
      this.nativeHTTP.setDataSerializer('json');
      if (additionalHeaders) {
        additionalHeaders.forEach(header => {
          this.nativeHTTP.setHeader('*', header.title, header.value);
        });
        return;
      }
    } else {
      if (this.isFormDataRequest) {
      } else {
        this.headers.append("Content-Type", "application/json;charset=utf-8");
      }
      if (additionalHeaders) {
        additionalHeaders.forEach(header => {
          this.headers.append(header.title, header.value);
        });
        return;
      }
    }
  }


}

export class HeaderModel {
  public title: string;
  public value: string;

  public getTextHeader(): HeaderModel {
    let header = new HeaderModel();
    header.title = "Accept";
    header.value = "text/plain";
    return header;
  }

  public getJsonHeader() {
    let header = new HeaderModel();
    header.title = "Accept";
    header.value = "application/json";
    return header;
  }
}