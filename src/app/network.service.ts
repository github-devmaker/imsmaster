import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MImsMaster, MModel, MModelEdit, ModelEtdModelDetail, model_etd_mst_program, model_filter_model } from './models';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  baseApiUrl: string = 'http://dciweb2.dci.daikin.co.jp/imsmasterapi';
  // baseApiUrl: string = 'https://localhost:7094';
  constructor(private http: HttpClient) { }

  getImsMasterData(data: any): Observable<any> { // ดึงข้อมูล ims master model ทั้งหมด
    return this.http.post<any>(this.baseApiUrl + '/getall', { line: data.line, fac: data.fac, proId: (data.proId != null ? data.proId.toString() : '').toString(), model: data.model });
  }

  // getFilterProgram(fac: string, line: string): Observable<any> {
  //   return this.http.post<any>(this.baseApiUrl + '/filter/program/', { fac: fac, proId: "", line: line });
  // }

  // getFilterModel(fac: string, line: string, proId: string): Observable<any> {
  //   return this.http.post<any>(this.baseApiUrl + '/filter/model/', { fac: fac, line: line, proId: proId });
  // }

  getFilters(data: any): Observable<any> {
    return this.http.post<any>(this.baseApiUrl + '/filter/', { line: data.line, fac: data.fac, proId: (data.proId != null ? data.proId.toString() : ''), model: data.model });
  }

  getRank(fac: string): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + '/rank/' + fac);
  }

  editModel(obj: MModelEdit) {
    // obj.mId =  modelData.mId;
    // obj.pId =  modelData.pId;
    // obj.ptId =  modelData.ptId;
    return this.http.post<any>(this.baseApiUrl + '/model/edit/', obj);
  }


  connectSoap() {
    return this.http.post<any>('http://websrv01.dci.daikin.co.jp/scmservice/authen.asmx?op=LoginADAuthen', { username: 'peerapong.k', password: 'Pe25er6a' });
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

  login(id:string){
    return this.http.get(this.baseApiUrl + '/user/login/' + id);
  }
}
