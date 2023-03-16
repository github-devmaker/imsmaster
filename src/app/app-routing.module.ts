import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImsMasterComponent } from './ims-master/ims-master.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path:'',component:ImsMasterComponent,title:'IMS MASTER'},
  { path:'login',component:LoginComponent,title:'IMS MASTER'},
  { path:'**',component:ImsMasterComponent,title:'IMS MASTER'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
