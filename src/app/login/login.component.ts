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
  dciId: string = '';
  dataSet = [];
  constructor(private dialog: MatDialog,private network:NetworkService) {
    var id = localStorage.getItem('dci_id');
    if (id !== null && id.length) {
      this.dciId = id;
      this.login();
    }
  }
  login() {
    if (this.dciId.trim() != '') {
      this.network.login(this.dciId).subscribe({
        next:(res)=>{
          console.log(res);
          if(res !== null){
            localStorage.setItem('name',res['name']);
            localStorage.setItem('surn',res['surn']);
            localStorage.setItem('dci_id', this.dciId);
            location.reload();
          }
        },error:(err)=>{
        }
      });
    }
    // let dialogRef = this.loading();
    // setTimeout(() => {
    //   dialogRef.close();
    // }, 3000);
  }
  loading() {
    return this.dialog.open(LoadingComponent, {});
  }
}
