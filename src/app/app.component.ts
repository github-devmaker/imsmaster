import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'devworker';
  loginState = false;
  constructor(){
    if(localStorage.getItem('dci_id') !== null){
       this.loginState = true;
    }
  }
}
