import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MModel, MModelEdit } from './models';
@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  baseApiUrl: string = 'http://dciweb2.dci.daikin.co.jp/imsmasterapi';
  // baseApiUrl: string = 'http://localhost:7288';
  constructor(private http: HttpClient) { }

  getImsMasterData(data: any): Observable<any> { // ดึงข้อมูล ims master model ทั้งหมด
    return this.http.post<any>(this.baseApiUrl + '/getall', { line: data.line, fac: data.fac, proId: (data.proId != null ? data.proId.toString() : '').toString(), model: data.model });
  }

  getFilters(data: any): Observable<any> {
    return this.http.post<any>(this.baseApiUrl + '/filter/', { line: data.line, fac: data.fac, proId: (data.proId != null ? data.proId.toString() : ''), model: data.model });
  }

  getRank(fac: string): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/rank/' + fac);
  }

  editModel(obj: MModelEdit) {
    return this.http.post<any>(this.baseApiUrl + '/model/edit/', obj);
  }

  connectSoap() {
    this.http.get('http://websrv01.dci.daikin.co.jp/scmservice/authen.asmx/LoginADAuthen?username=peerapong.k&password=Pe25er6a', {
      responseType: 'text',
      headers: {
        "Content-Type": "text/xml",
        "Accept": "application/json"
      }
    }).subscribe({
      next: (res) => {
        // console.log(parseXml(res))
        console.log(res)
      }
    });
  }

  checkExistMID(obj: MModel): Observable<any> {
    return this.http.post<any>(this.baseApiUrl + '/model/exist/', obj);
  }

  addModel(obj: MModel): Observable<any> {
    return this.http.post<any>(this.baseApiUrl + '/model/add/', obj);
  }

  deleteModel(obj: any): Observable<any> {
    return this.http.post<any>(this.baseApiUrl + '/model/delete/', obj);
  }

  login(id: string) {
    return this.http.get(this.baseApiUrl + '/user/login/' + id);
  }

  loginAuthan(username:string,password:string){
    return this.http.get('http://websrv01.dci.daikin.co.jp/BudgetCharts/BudgetRestService/api/authen?username=' + username + '&password=' + password);
  }
}
