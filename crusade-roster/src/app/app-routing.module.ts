import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CrusadeListComponent } from './pages/crusade-list/crusade-list.component';


const routes: Routes = [
  {
    path:'',
    redirectTo : 'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path: 'crusade-list/:name',
        component: CrusadeListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
