import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../loading/loading.component';
import { MModel } from '../models';
import { NetworkService } from '../network.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  dciUsername: string = '';
  dciPassword: string = '';
  showLoginError:boolean = false;
  dataSet = [];
  constructor(private dialog: MatDialog, private network: NetworkService) {
    var id = localStorage.getItem('dci_id');
    if (id !== null && id.length) {
      this.dciUsername = id;
      this.login();
    }
  }
  login() {
    if (this.dciUsername.trim() != '' && this.dciPassword.trim() != '') {
      this.network.loginAuthan(this.dciUsername, this.dciPassword).subscribe({
        next: (res) => {
          console.log(Object.keys(res).length,res[0].EmpCode)
          if (res != null && Object.keys(res).length > 0 && res[0].EmpCode != null) {
            localStorage.setItem('name', res[0].FullName);
            localStorage.setItem('emCode', res[0].EmpCode);
            localStorage.setItem('dci_id', this.dciUsername);
            location.reload();
            this.showLoginError = false;
          }else{
            this.showLoginError = true;
          }
          console.log(res);
        }, error: (err) => {
          alert('ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก : ' + err.message)
        }
      })
      // this.network.login(this.dciId).subscribe({
      //   next:(res)=>{
      //     console.log(res);
      //     if(res !== null){
      //       localStorage.setItem('name',res['name']);
      //       localStorage.setItem('surn',res['surn']);
      //       localStorage.setItem('dci_id', this.dciId);
      //       location.reload();
      //     }
      //   },error:(err)=>{
      //   }
      // });
    }
  }
  loading() {
    return this.dialog.open(LoadingComponent, {});
  }
}
