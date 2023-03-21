import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @ViewChild('sideNav') sideNav:MatSidenav;
  listMenu: any[] = [
    { name: 'imsmaster', text: 'IMS MASTER',nameTh:'จัดการเครื่องมือวัด', routeLink: '' }
  ];
  emcode:string = '41256';
  imgUser:string = '';
  opened: boolean = false;
  username:string = '';
  constructor(private router:Router) {
    console.log(localStorage);
   
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('name');
    this.imgUser = 'http://dcidmc.dci.daikin.co.jp/PICTURE/'  + localStorage.getItem('emCode')  + '.JPG';
  }
  openMenuComponent() {
  }
  selectedComponent(menuDetails: any) {
    this.sideNav.toggle();
  }
  logout() {
    localStorage.clear();
    location.reload();
  }
}
